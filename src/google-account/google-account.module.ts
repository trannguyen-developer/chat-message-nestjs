import { Module } from '@nestjs/common';
import { GoogleAccountService } from './google-account.service';
import { GoogleAccountController } from './google-account.controller';

@Module({
  controllers: [GoogleAccountController],
  providers: [GoogleAccountService],
})
export class GoogleAccountModule {}
