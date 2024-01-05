import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('sign-in')
  signIn(@Body() signInDTO: SignInDto, @Res() res: Response) {
    return this.authService.signIn(signInDTO, res);
  }

  @Post('sign-up')
  signUp(@Body() userCreateDTO: CreateUserDto) {
    return this.authService.signUp(userCreateDTO);
  }
}
