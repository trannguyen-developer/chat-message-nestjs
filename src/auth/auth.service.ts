import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from '../auth/dto/signin.dto';
import { Response } from 'express';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { expiresTimeRefreshToken, jwtConstants } from '../auth/constants';
import { MailService } from '../mail/mail.service';
import { VerifyEmailService } from '../verify-email/verify-email.service';
import { RedisService } from 'src/redis/redis.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailServices: MailService,
    private verifyEmailService: VerifyEmailService,
    private redisService: RedisService,
  ) {}

  hashPassword(password: string) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  async getToken(
    payload: Buffer | object,
    options?: JwtSignOptions,
  ): Promise<string> {
    const token = await this.jwtService.signAsync(payload, options);

    return token;
  }

  async comparePassword(
    password: string | undefined,
    storePasswordHash: string | undefined,
  ): Promise<any> {
    return await bcrypt.compare(password || '', storePasswordHash || '');
  }

  async authentication(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOneBy({
      email,
    });

    const check = await this.comparePassword(password, user?.password);

    if (!user || !check) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async signIn(signInDTO: SignInDto, res?: Response) {
    const { email } = signInDTO;

    const payload = { email };
    const accessToken = await this.getToken(payload);
    const refreshToken = await this.getToken(payload, {
      expiresIn: expiresTimeRefreshToken,
    });

    await this.usersRepository.update(
      { email },
      { refresh_token: refreshToken },
    );

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user.is_verify) {
      await this.redisService.addToken(accessToken);
      res.json({
        success: true,
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
          is_verify: user.is_verify,
        },
      });
    } else {
      await this.verifyEmailService.fetchVerifyCode({ email });

      await this.redisService.cleanupExpiredTokens();

      res.json({
        success: true,
        data: {
          is_verify: user.is_verify,
        },
      });
    }
  }

  async signUp(userCreateDTO: CreateUserDto, res?: Response) {
    console.log('test 1 1 1 22');

    try {
      const { email, username, password, confirmPassword } = userCreateDTO;

      const emailExist = await this.usersRepository.findOne({
        where: { email },
      });

      if (confirmPassword !== password) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: 'Confirm password not correct!' });
      }

      if (emailExist) {
        return res
          .status(HttpStatus.CONFLICT)
          .json({ success: false, message: 'Email existed' });
      }

      // hash password
      const passwordHash = this.hashPassword(password);

      const { verifyCode, expiredTime } =
        this.verifyEmailService.renderVerifyCode();

      const user = this.usersRepository.create({
        email,
        profile: { username },
        password: passwordHash,
        verify: { verify_code: verifyCode, expired_time: expiredTime },
      });

      await this.usersRepository.save(user);

      await this.mailServices.sendMail({
        toEmail: email,
        subject: 'Verify email',
        template: './verify-email',
        context: {
          name: username,
          verifyCode,
        },
      });

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async refreshToken(refreshToken: string, res?: Response) {
    const existingRefreshToken = await this.usersRepository.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!existingRefreshToken) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        data: 'Not found refresh_token',
      });
    }

    // Xác minh refreshToken
    let payloadToken;
    try {
      payloadToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret,
      });
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        data: "Can't decode refreshToken",
      });
    }

    // create new access token
    const newAccessToken = await this.getToken({ email: payloadToken?.email });

    await this.redisService.addToken(newAccessToken);
    return res.json({ success: true, data: { access_token: newAccessToken } });
  }

  async logout(userId: string, authorization: string) {
    try {
      await this.usersRepository
        .createQueryBuilder()
        .update(User)
        .set({ refresh_token: null })
        .where('id = :id', { id: userId })
        .execute();

      const token = authorization.split(' ')?.[1];
      await this.redisService.removeToken(token);
      await this.redisService.cleanupExpiredTokens();
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async authGoogle(req, res) {
    try {
      const { access_token } = req.body;

      // verify access token google
      const response: any = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
      );

      const { email, verified_email, name, picture } = response.data;

      // check email google verified
      if (!verified_email) {
        return res
          .status(400)
          .json({ success: false, message: 'Email google not verified' });
      }

      const payload = { email };
      const accessToken = await this.getToken(payload);
      const refreshToken = await this.getToken(payload, {
        expiresIn: expiresTimeRefreshToken,
      });

      const emailExist = await this.usersRepository.findOne({
        where: { email },
      });

      // check email not exist
      if (!emailExist) {
        const user = this.usersRepository.create({
          email,
          is_google_account: true,
          googleAccount: {
            google_name: name,
            picture,
          },
        });
        await this.usersRepository.save(user);
      }

      // check email exist is google account
      if (emailExist?.is_google_account) {
        await this.usersRepository.update(
          { email },
          {
            refresh_token: refreshToken,
          },
        );
      }

      // check email exist not google account
      if (!emailExist?.is_google_account) {
        await this.usersRepository.update(
          { email },
          {
            refresh_token: refreshToken,
            is_google_account: true,
            googleAccount: {
              google_name: name,
              picture,
            },
          },
        );
      }

      await this.redisService.addToken(accessToken);
      return res.json({
        success: true,
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: 'Authentication failed' });
    }
  }
}
