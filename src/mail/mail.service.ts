import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerServices: MailerService) {}
  async sendMail({ toEmail, subject, template, context }) {
    await this.mailerServices.sendMail({
      to: toEmail,
      subject: subject,
      template: template,
      context,
      // context: {
      //   name: userCreateDTO.username,
      // },
    });
  }
}
