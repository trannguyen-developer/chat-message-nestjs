import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { VerifyEmailModule } from './verify-email/verify-email.module';
import { VerifyEmail } from './verify-email/verify-email.entity';
import { HelpersModule } from './helpers/helpers.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { ResetPassword } from './reset-password/reset-password.entity';
import { RedisModule } from './redis/redis.module';
import { UserController } from './user/user.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenCleanupService } from './cron-job/tokenCleanupService';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, VerifyEmail, ResetPassword],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    MailModule,
    PassportModule,
    AuthModule,
    UserModule,
    VerifyEmailModule,
    HelpersModule,
    ResetPasswordModule,
    RedisModule,
  ],
  controllers: [UserController],
  providers: [TokenCleanupService],
})
export class AppModule {}
