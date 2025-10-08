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
import { ScheduleModule } from '@nestjs/schedule';
import { TokenCleanupService } from './cron-job/tokenCleanupService';
import { ConversationModule } from './conversation/conversation.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { GoogleAccountModule } from './google-account/google-account.module';
import { UserProfile } from './user-profile/entities/user-profile.entity';
import { GoogleAccount } from './google-account/entities/google-account.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/auth.guard';
import { MessageModule } from './message/message.module';

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
      entities: [User, VerifyEmail, ResetPassword, UserProfile, GoogleAccount],
      autoLoadEntities: true,
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
    ConversationModule,
    UserProfileModule,
    GoogleAccountModule,
    MessageModule,
  ],
  providers: [
    TokenCleanupService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule {}
