import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { VerifyEmail } from './verify-email.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SendVerifyCodeDTO, VerifyCodeDTO } from './dto/verify-email.dto';
import { User } from '../auth/user.entity';
import { Response } from 'express';
import { MailService } from '../mail/mail.service';
import { HelpersService } from '../helpers/helpers.service';

@Injectable()
export class VerifyEmailService {
  constructor(
    @InjectRepository(VerifyEmail)
    private verifyEmailRepository: Repository<VerifyEmail>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailServices: MailService,
    private helpersServices: HelpersService,
  ) {}

  renderVerifyCode() {
    try {
      const randomSixDigits = String(
        Math.floor(100000 + Math.random() * 900000),
      );

      const expiredTime = new Date();
      expiredTime.setMinutes(expiredTime.getMinutes() + 5);

      return { verifyCode: randomSixDigits, expiredTime: expiredTime };
    } catch (error) {
      console.warn('error', error);
      throw error;
    }
  }

  async fetchVerifyCode(verifyCodeDto: VerifyCodeDTO) {
    try {
      const verifyEmail = await this.verifyEmailRepository.findOne({
        relations: ['user', 'user.profile'],
        where: { user: { email: verifyCodeDto.email } },
      });

      const { verifyCode, expiredTime } = this.renderVerifyCode();

      console.log('verifyEmail', verifyEmail);

      if (verifyEmail?.user.id) {
        await this.verifyEmailRepository.update(
          { user: { id: verifyEmail?.user.id } },
          { verify_code: verifyCode, expired_time: expiredTime },
        );

        await this.mailServices.sendMail({
          toEmail: verifyCodeDto.email,
          subject: 'Verify email',
          template: './verify-email',
          context: {
            name: verifyEmail.user.profile.username,
            verifyCode,
          },
        });
      }

      return { verifyCode, expiredTime: expiredTime };
    } catch (error) {
      console.warn('error', error);
      throw error;
    }
  }

  async getVerifyCode(verifyCodeDto: VerifyCodeDTO, res?: Response) {
    try {
      const { verifyCode } = await this.fetchVerifyCode(verifyCodeDto);

      res.json({ success: true, data: { verifyCode } });
    } catch (error) {
      console.warn('error', error);
      throw error;
    }
  }

  async sendVerifyCode(sendVerifyCodeDto: SendVerifyCodeDTO, res: Response) {
    try {
      const user = await this.usersRepository.findOne({
        relations: ['verify'],
        where: { email: sendVerifyCodeDto.email },
      });

      if (!user)
        throw new HttpException("Can't find user", HttpStatus.NOT_FOUND);

      if (user.verify.verify_code !== sendVerifyCodeDto.code)
        throw new HttpException(
          'Verify code not correct',
          HttpStatus.BAD_REQUEST,
        );

      const expirationTime = new Date(user.verify.expired_time); // Thay thế bằng thời gian hết hạn thực tế của bạn
      const isExpired = this.helpersServices.isExpired(expirationTime);

      if (isExpired) {
        throw new HttpException(
          'Verification code has expired.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.usersRepository.update(
        { email: sendVerifyCodeDto.email },
        { is_verify: true },
      );

      res.json({ success: true, message: 'Verify email success' });
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
}
