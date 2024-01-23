import { Injectable } from '@nestjs/common';

@Injectable()
export class HelpersService {
  isExpired(expirationTime: Date): boolean {
    const currentTime = new Date();
    return expirationTime < currentTime;
  }
}
