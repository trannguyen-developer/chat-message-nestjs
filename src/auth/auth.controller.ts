import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  private readonly authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  signIn(@Body() signInDTO: SignInDto, @Res() res: Response) {
    return this.authService.signIn(signInDTO, res);
  }

  @Post('sign-up')
  signUp(@Body() userCreateDTO: CreateUserDto, @Res() res: Response) {
    return this.authService.signUp(userCreateDTO, res);
  }

  @Post('refresh-token')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
