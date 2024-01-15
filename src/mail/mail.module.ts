import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';

@Module({
  imports: [MailerModule.forRootAsync({
    useFactory: () => ({
      transport: {
        host: process.env.MAIL_HOST,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"Chat app demo" <${process.env.MAIL_USER}>`,
      },
      template: {
        dir: join(__dirname, '../src/templates/email'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  })],
  // controllers: [UserController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
