import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../auth/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from 'src/user-profile/entities/user-profile.entity';
import { GoogleAccount } from 'src/google-account/entities/google-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile, GoogleAccount])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
