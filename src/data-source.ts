import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './auth/user.entity';
import { VerifyEmail } from './verify-email/verify-email.entity';
import { ResetPassword } from './reset-password/reset-password.entity';
import { UserProfile } from './user-profile/entities/user-profile.entity';
import { GoogleAccount } from './google-account/entities/google-account.entity';

config();

// Kiểm tra môi trường: dev = TS, prod/Docker = JS
const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity.js'],
  // entities: isProduction
  //   ? ['dist/**/*.entity.js'] // production build JS
  //   : [User, UserProfile, VerifyEmail, ResetPassword, GoogleAccount], // dev TS
  migrations: isProduction ? ['dist/migrations/*.js'] : ['src/migrations/*.ts'],
  synchronize: false,
});
