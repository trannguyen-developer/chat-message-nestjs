import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyEmail } from './verify-email.entity';
import { VerifyEmailService } from './verify-email.service';
import { VerifyEmailController } from './verify-email.controller';
import { User } from '../auth/user.entity';
import { MailModule } from '../mail/mail.module';
import { HelpersModule } from '../helpers/helpers.module';
import { UserProfile } from 'src/user-profile/entities/user-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerifyEmail, User, UserProfile]),
    MailModule,
    HelpersModule,
  ],
  controllers: [VerifyEmailController],
  providers: [VerifyEmailService],
  exports: [VerifyEmailService],
})
export class VerifyEmailModule {}
