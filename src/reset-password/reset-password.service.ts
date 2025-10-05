import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResetPasswordDTO, SendEmailDTO } from './dto/reset-password';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../auth/user.entity';
import { ResetPassword } from './reset-password.entity';
import { Response } from 'express';
import { HelpersService } from '../helpers/helpers.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(ResetPassword)
    private resetPasswordRepository: Repository<ResetPassword>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailServices: MailService,
    private helpersServices: HelpersService,
    private authServices: AuthService,
  ) {}

  async createToken(findUser: User): Promise<string> {
    try {
      const randomByte = randomBytes(16);
      const tokenResetPW = randomByte.toString('base64');

      const expiredTime = new Date();
      expiredTime.setMinutes(expiredTime.getMinutes() + 30);

      if (findUser?.resetPW?.id) {
        await this.resetPasswordRepository.update(
          { id: findUser.resetPW.id as any },
          { token: tokenResetPW, expired_time: expiredTime },
        );
      } else {
        const newResetPWToken = this.resetPasswordRepository.create({
          token: tokenResetPW,
          expired_time: expiredTime,
        });

        await this.resetPasswordRepository.save(newResetPWToken);

        await this.usersRepository.update(
          { id: findUser.id as any },
          { resetPW: newResetPWToken },
        );
      }

      return tokenResetPW;
    } catch (error) {
      console.error('error', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async createAndSendEmail(username: string, email: string, token: string) {
    try {
      await this.mailServices.sendMail({
        toEmail: email,

        subject: 'Reset password App Chat',
        template: './reset-password',
        context: {
          name: username,
          domainClient: process.env.DOMAIN_CLIENT,
          linkResetPW: `${process.env.DOMAIN_CLIENT}/reset-password?token=${token}`,
        },
      });
    } catch (error) {
      console.error('error', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async sendEmailResetPW(sendEmailDTO: SendEmailDTO, res: Response) {
    try {
      const findUser = await this.usersRepository.findOneBy({
        email: sendEmailDTO.email,
      });

      if (!findUser) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: 'Email not exist' });
      }

      const newToken = await this.createToken(findUser);

      if (!newToken) {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await this.createAndSendEmail(
        findUser.profile.username,
        findUser.email,
        newToken,
      );

      res.json({ success: true });
    } catch (error) {
      console.error('error', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async changePassword(resetPasswordDTO: ResetPasswordDTO, res: Response) {
    try {
      const findToken = await this.resetPasswordRepository.findOneBy({
        token: resetPasswordDTO.token,
      });

      if (!findToken) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: 'Token not exist' });
      }

      const isExpiredToken = this.helpersServices.isExpired(
        findToken.expired_time,
      );

      if (isExpiredToken) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: 'Token expired time' });
      }
      if (resetPasswordDTO.confirmPassword !== resetPasswordDTO.password) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: 'Confirm password not correct!' });
      }

      const passwordHash = this.authServices.hashPassword(
        resetPasswordDTO.password,
      );

      await this.usersRepository.update(
        { resetPW: findToken },
        { password: passwordHash },
      );

      res.json({ success: true, message: 'Reset password success!' });
    } catch (error) {
      console.error('error', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }
}
