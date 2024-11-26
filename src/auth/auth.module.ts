import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { expiresTimeAccessToken, jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { MailModule } from '../mail/mail.module';
import { VerifyEmailModule } from '../verify-email/verify-email.module';
import { RedisModule } from 'src/redis/redis.module';
import { AuthenticationGuard } from './guards/auth.guard';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    VerifyEmailModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: expiresTimeAccessToken },
    }),
    MailModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RedisModule,
    RedisService,
    AuthenticationGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
