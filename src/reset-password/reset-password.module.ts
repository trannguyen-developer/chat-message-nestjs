import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { ResetPassword } from './reset-password.entity';
import { ResetPasswordController } from './reset-password.controller';
import { MailModule } from 'src/mail/mail.module';
import { HelpersModule } from 'src/helpers/helpers.module';
import { AuthModule } from 'src/auth/auth.module';

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
