import {
  Controller,
  Get,
  Headers,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private readonly userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Get('info')
  getInfo(@Req() req, @Res() res) {
    return this.userService.getInfo(req, res);
  }

  @Get('search')
  searchUser(
    @Headers('authorization') authorization,
    @Query('search') searchKey,
    @Res() res,
  ) {
    return this.userService.searchUser(authorization, searchKey, res);
  }
}
