import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResetPasswordDTO, SendEmailDTO } from './dto/reset-password';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm/repository/Repository';
import { User } from 'src/auth/user.entity';
import { ResetPassword } from './reset-password.entity';
import { Response } from 'express';
import { HelpersService } from 'src/helpers/helpers.service';
import { AuthService } from 'src/auth/auth.service';

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
      expiredTime.setMinutes(expiredTime.getMinutes() + 60);

      if (findUser.resetPW?.id) {
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
          { id: findUser.resetPW.id as any },
          { resetPW: newResetPWToken },
        );
      }

      return tokenResetPW;
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async createAndSendEmail(email: string, token: string) {
    try {
      await this.mailServices.sendMail({
        toEmail: email,

        subject: 'Reset password App Chat',
        template: './reset-password',
        // template: './verify-email',
        context: {
          name: 'name1',
          domainClient: 'http://ap-chat.com1',
          linkResetPW: 'http://ap-chat.com/resest-password1',
          token: token,
          // verifyCode: 34343
        },
      });
    } catch (error) {
      console.log('error', error);
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

      if (!findUser) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

      const newToken = await this.createToken(findUser);

      if (!newToken) {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await this.createAndSendEmail(findUser.email, newToken);

      res.json({ success: true });
    } catch (error) {
      console.log('error', error);
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
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, message: 'Unauthorized' });
      }

      const isExpiredToken = this.helpersServices.isExpired(
        findToken.expired_time,
      );

      if (isExpiredToken) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
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
      console.log('error', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }
}
