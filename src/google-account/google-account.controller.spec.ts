import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAccountController } from './google-account.controller';
import { GoogleAccountService } from './google-account.service';

describe('GoogleAccountController', () => {
  let controller: GoogleAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleAccountController],
      providers: [GoogleAccountService],
    }).compile();

    controller = module.get<GoogleAccountController>(GoogleAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
