import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { ResetPassword } from './reset-password.entity';
import { ResetPasswordController } from './reset-password.controller';
import { MailModule } from '../mail/mail.module';
import { HelpersModule } from '../helpers/helpers.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResetPassword, User]),
    MailModule,
    HelpersModule,
    AuthModule,
  ],

  providers: [ResetPasswordService],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
