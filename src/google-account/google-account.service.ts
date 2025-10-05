import { Injectable } from '@nestjs/common';
import { CreateGoogleAccountDto } from './dto/create-google-account.dto';
import { UpdateGoogleAccountDto } from './dto/update-google-account.dto';

@Injectable()
export class GoogleAccountService {
  create(createGoogleAccountDto: CreateGoogleAccountDto) {
    return 'This action adds a new googleAccount';
  }

  findAll() {
    return `This action returns all googleAccount`;
  }

  findOne(id: number) {
    return `This action returns a #${id} googleAccount`;
  }

  update(id: number, updateGoogleAccountDto: UpdateGoogleAccountDto) {
    return `This action updates a #${id} googleAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} googleAccount`;
  }
}
