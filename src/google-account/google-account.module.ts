import { Module } from '@nestjs/common';
import { GoogleAccountService } from './google-account.service';
import { GoogleAccountController } from './google-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { HelpersModule } from 'src/helpers/helpers.module';
import { VerifyEmail } from 'src/verify-email/verify-email.entity';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerifyEmail, User]),
    MailModule,
    HelpersModule,
  ],
  controllers: [GoogleAccountController],
  providers: [GoogleAccountService],
})
export class GoogleAccountModule {}
