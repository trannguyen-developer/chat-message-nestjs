import { DataSource } from 'typeorm';
import { config } from 'dotenv';

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
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  // entities: ['dist/**/*.entity.js'],
  // entities: isProduction
  //   ? ['dist/**/*.entity.js'] // production build JS
  //   : [User, UserProfile, VerifyEmail, ResetPassword, GoogleAccount], // dev TS
  migrations: isProduction ? ['dist/migrations/*.js'] : ['src/migrations/*.ts'],
  synchronize: false,
});
