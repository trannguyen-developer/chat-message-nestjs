import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GoogleAccountService } from './google-account.service';
import { CreateGoogleAccountDto } from './dto/create-google-account.dto';
import { UpdateGoogleAccountDto } from './dto/update-google-account.dto';

@Controller('google-account')
export class GoogleAccountController {
  constructor(private readonly googleAccountService: GoogleAccountService) {}

  @Post()
  create(@Body() createGoogleAccountDto: CreateGoogleAccountDto) {
    return this.googleAccountService.create(createGoogleAccountDto);
  }

  @Get()
  findAll() {
    return this.googleAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.googleAccountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoogleAccountDto: UpdateGoogleAccountDto) {
    return this.googleAccountService.update(+id, updateGoogleAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.googleAccountService.remove(+id);
  }
}
