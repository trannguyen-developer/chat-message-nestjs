import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import {
  accessTokensInRedis,
  expiresTimeAccessTokenMiniSeconds,
} from 'src/auth/constants';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST, // Địa chỉ Redis
      port: Number(process.env.REDIS_PORT), // Cổng Redis
      password: '', // Nếu Redis có mật khẩu
    });
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl); // EX: seconds, PX: milliseconds
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  // add token in list
  async addToken(token): Promise<void> {
    const expiresAt = Date.now() + expiresTimeAccessTokenMiniSeconds;
    await this.client.zadd(accessTokensInRedis, expiresAt, token);
  }

  // check token is valid in list
  async isTokenValid(token: string): Promise<boolean> {
    const now = Date.now();
    const exists = await this.client.zscore(accessTokensInRedis, token);
    return exists && Number(exists) > now;
  }

  // remove token in list
  async removeToken(token): Promise<void> {
    await this.client.zrem(accessTokensInRedis, token);
  }

  async getAllToken(): Promise<string[]> {
    const tokens = await this.client.zrange(accessTokensInRedis, 0, -1);
    return tokens;
  }

  // clear token expired
  async cleanupExpiredTokens(): Promise<void> {
    const now = Date.now();
    await this.client.zremrangebyscore(accessTokensInRedis, '-inf', now);
  }
}
