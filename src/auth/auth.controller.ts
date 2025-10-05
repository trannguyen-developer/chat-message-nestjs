import {
  Body,
  Controller,
  Delete,
  Post,
  Res,
  UseGuards,
  Param,
  Headers,
  Req,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { SignInDto } from '../auth/dto/signin.dto';
import { Response } from 'express';
import { LocalAuthGuard } from '../auth/guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  signIn(@Body() signInDTO: SignInDto, @Res() res: Response) {
    return this.authService.signIn(signInDTO, res);
  }

  @Post('sign-up')
  signUp(@Body() userCreateDTO: CreateUserDto, @Res() res: Response) {
    return this.authService.signUp(userCreateDTO, res);
  }

  @Post('auth-google')
  authGoogle(@Req() req: any, @Res() res: Response) {
    return this.authService.authGoogle(req, res);
  }

  @Post('refresh-token')
  refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    return this.authService.refreshToken(refreshToken, res);
  }

  @Delete('logout/:id')
  logout(@Param('id') userId: string, @Headers('authorization') authorization) {
    return this.authService.logout(userId, authorization);
  }
}
