import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { VerifyEmail } from './verify-email.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SendVerifyCodeDTO, VerifyCodeDTO } from './dto/verify-email.dto';
import { User } from 'src/auth/user.entity';
import { Response } from 'express';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class VerifyEmailService {
  constructor(
    @InjectRepository(VerifyEmail)
    private verifyEmailRepository: Repository<VerifyEmail>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailServices: MailService,
  ) {}

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

  async getVerifyCode(verifyCodeDto: VerifyCodeDTO, res: Response) {
    try {
      const findUser = await this.usersRepository.findOneBy({
        email: verifyCodeDto.email,
      });

      const randomSixDigits = String(
        Math.floor(100000 + Math.random() * 900000),
      );

      if (findUser.verify?.id) {
        await this.verifyEmailRepository.update(
          { id: findUser.verify.id },
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

      await this.mailServices.sendMail({
        toEmail: findUser.email,
        subject: 'Welcome to my website',
        template: './verify-email',
        context: {
          name: findUser.username,
          verifyCode: randomSixDigits,
        },
      });

      res.json({ success: true, data: { verifyCode: randomSixDigits } });
    } catch (error) {
      console.warn('error', error);
      throw new HttpException("Can't find user", HttpStatus.NOT_FOUND, error);
    }
  }
  x;

  async sendVerifyCode(sendVerifyCodeDto: SendVerifyCodeDTO, res: Response) {
    try {
      const user = await this.usersRepository.find({
        relations: ['verify', 'verify.id'],
      });

      console.log('user', user);
      res.json({ oke: 'oke' });
    } catch (error) {
      console.log('error', error);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
