import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticationGuard } from '../auth/guards/auth.guard';

@Controller('user')
@UseGuards(AuthenticationGuard)
export class UserController {
  private readonly userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Get('info')
  getInfo(@Headers('authorization') authorization) {
    return this.userService.getInfo(authorization);
  }

  @Get('my-info')
  getMyInfo(@Headers('authorization') authorization) {
    return this.userService.getInfo(authorization);
  }
}
