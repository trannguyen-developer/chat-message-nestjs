import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  providers: [RedisService], // Khai báo provider
  exports: [RedisService], // Để sử dụng ở module khác
})
export class RedisModule {}
