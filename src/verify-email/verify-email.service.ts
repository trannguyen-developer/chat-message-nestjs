import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Res,
} from '@nestjs/common';
import { VerifyEmail } from './verify-email.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SendVerifyCodeDTO, VerifyCodeDTO } from './dto/verify-email.dto';
import { User } from '../auth/user.entity';
import { Response } from 'express';
import { MailService } from '../mail/mail.service';
import { HelpersService } from '../helpers/helpers.service';
import { randomBytes } from 'crypto';

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

  async fetchVerifyCode(verifyCodeDto: VerifyCodeDTO) {
    try {
      const findUser = await this.usersRepository.findOneBy({
        email: verifyCodeDto.email,
      });

      const randomSixDigits = String(
        Math.floor(100000 + Math.random() * 900000),
      );

      const expiredTime = new Date();
      expiredTime.setMinutes(expiredTime.getMinutes() + 5);

      if (findUser.verify?.id) {
        await this.verifyEmailRepository.update(
          { id: findUser.verify.id },
          { verify_code: randomSixDigits, expired_time: expiredTime },
        );
      } else {
        const newVerifyEmail = this.verifyEmailRepository.create({
          verify_code: randomSixDigits,
          expired_time: expiredTime,
        });

        await this.verifyEmailRepository.save(newVerifyEmail);

        await this.usersRepository.update(
          { email: verifyCodeDto.email },
          { verify: newVerifyEmail },
        );
      }

      await this.mailServices.sendMail({
        toEmail: findUser.email,
        subject: 'Verify email',
        template: './verify-email',
        context: {
          name: findUser.username,
          verifyCode: randomSixDigits,
        },
      });

      return randomSixDigits;
    } catch (error) {
      console.warn('error', error);
      throw error;
    }
  }

  async createVerifyCode(verifyCodeDto: VerifyCodeDTO) {
    try {
      const findUser = await this.usersRepository.findOneBy({
        email: verifyCodeDto.email,
      });

      const randomSixDigits = String(
        Math.floor(100000 + Math.random() * 900000),
      );

      if (findUser.verify) {
        await this.verifyEmailRepository.update(
          { id: findUser.verify as any },
          { verify_code: randomSixDigits },
        );
      } else {
        const newVerifyEmail = this.verifyEmailRepository.create({
          verify_code: randomSixDigits,
        });

        await this.verifyEmailRepository.save(newVerifyEmail);

        await this.usersRepository.update(
          { email: verifyCodeDto.email },
          { verify: newVerifyEmail },
        );
      }

      return randomSixDigits;
    } catch (error) {
      throw new HttpException("Can't find user", HttpStatus.NOT_FOUND, error);
    }
  }

  async getVerifyCode(verifyCodeDto: VerifyCodeDTO, res?: Response) {
    try {
      const verifyCode = await this.fetchVerifyCode(verifyCodeDto);

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
