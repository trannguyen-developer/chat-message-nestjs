import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from 'src/auth/dto/signin.dto';
import { Response } from 'express';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { expiresTimeRefreshToken, jwtConstants } from 'src/auth/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
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

    res.json({
      success: true,
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  }

  async signUp(userCreateDTO: CreateUserDto, res?: Response) {
    const { email, username, password } = userCreateDTO;

    const emailExist = await this.usersRepository.findOne({
      where: { email },
    });

    if (emailExist) {
      throw new HttpException('Username existed', HttpStatus.CONFLICT);
    }

    // hash password
    const passwordHash = await this.hashPassword(password);

    const payload = { email };
    const accessToken = await this.getToken(payload);
    const refreshToken = await this.getToken(payload, {
      expiresIn: expiresTimeRefreshToken,
    });

    // await this.mailServices.sendMail({
    //   toEmail: userCreateDTO.email,
    //   subject: 'Welcome to my website',
    //   template: './welcome',
    //   context: {
    //     name: userCreateDTO.username,
    //   },
    // });

    const user = await this.usersRepository.create({
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
