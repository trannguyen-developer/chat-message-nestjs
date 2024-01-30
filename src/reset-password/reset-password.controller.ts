import { Body, Controller, Post, Res } from '@nestjs/common';
import { ResetPasswordDTO, SendEmailDTO } from './dto/reset-password';
import { ResetPasswordService } from './reset-password.service';
import { Response } from 'express';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post('send-email')
  sendEmailResetPW(@Body() sendEmailDTO: SendEmailDTO, @Res() res: Response) {
    return this.resetPasswordService.sendEmailResetPW(sendEmailDTO, res);
  }

  @Post('change-password')
  changePassword(
    @Body() resetPasswordDTO: ResetPasswordDTO,
    @Res() res: Response,
  ) {
    return this.resetPasswordService.changePassword(resetPasswordDTO, res);
  }
}
