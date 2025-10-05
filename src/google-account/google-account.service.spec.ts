import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAccountService } from './google-account.service';

describe('GoogleAccountService', () => {
  let service: GoogleAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleAccountService],
    }).compile();

    service = module.get<GoogleAccountService>(GoogleAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
