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
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../auth/dto/signin.dto';
import { Response } from 'express';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  expiresTimeAccessToken,
  expiresTimeRefreshToken,
  jwtConstants,
} from '../auth/constants';
import { MailService } from '../mail/mail.service';
import { VerifyEmailService } from '../verify-email/verify-email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailServices: MailService,
    private verifyEmailService: VerifyEmailService,
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
    debugger;

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
      { access_token: accessToken, refresh_token: refreshToken },
    );

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user.is_verify) {
      res.json({
        success: true,
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
          is_verify: user.is_verify,
        },
      });
    } else {
      await this.verifyEmailService.getVerifyCode({ email }, res);

      res.json({
        success: true,
        data: {
          is_verify: user.is_verify,
        },
      });
    }
  }

  async signUp(userCreateDTO: CreateUserDto, res?: Response) {
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
          .json({ success: false, message: 'Username existed' });
      }

      // hash password
      const passwordHash = this.hashPassword(password);

      const payload = { email };
      const accessToken = await this.getToken(payload, {
        expiresIn: expiresTimeAccessToken,
      });
      const refreshToken = await this.getToken(payload, {
        expiresIn: expiresTimeRefreshToken,
      });

      const user = this.usersRepository.create({
        email,
        username,
        password: passwordHash,
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      await this.usersRepository.save(user);
      res.json({
        success: true,
        data: user,
      });

      await this.verifyEmailService.getVerifyCode({ email }, res);
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async refreshToken(refreshToken: string) {
    const existingRefreshToken = await this.usersRepository.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!existingRefreshToken) {
      throw new HttpException('Not found refresh_token', HttpStatus.NOT_FOUND);
    }

    // Xác minh refreshToken
    let payloadToken;
    try {
      payloadToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret,
      });
    } catch (error) {
      throw new HttpException(
        "Can't decode refreshToken",
        HttpStatus.FORBIDDEN,
      );
    }

    // create new access token
    const newAccessToken = await this.getToken(payloadToken);

    // save new token in database
    await this.usersRepository.update(
      { refresh_token: refreshToken },
      { access_token: newAccessToken },
    );
  }
}
