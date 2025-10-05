import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class TokenCleanupService {
  constructor(private readonly redisService: RedisService) {}

  @Cron('0 0 */3 * *') // Chạy 3 ngày 1 lần vào lúc 12h sáng
  cleanupExpiredTokens() {
    this.redisService.cleanupExpiredTokens(); // Tạo hàm dọn dẹp token hết hạn
  }
}
