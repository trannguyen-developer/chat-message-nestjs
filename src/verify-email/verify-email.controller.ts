import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { SendVerifyCodeDTO, VerifyCodeDTO } from './dto/verify-email.dto';
import { VerifyEmailService } from './verify-email.service';

@Controller('verify')
export class VerifyEmailController {
  constructor(private readonly verifyEmailService: VerifyEmailService) {}

  @Post('get-code')
  getVerifyCode(@Body() verifyCodeDto: VerifyCodeDTO, @Res() res: Response) {
    return this.verifyEmailService.getVerifyCode(verifyCodeDto, res);
  }

  @Post('send-code')
  sendVerifyCode(
    @Body() sendVerifyCodeDto: SendVerifyCodeDTO,
    @Res() res: Response,
  ) {
    return this.verifyEmailService.sendVerifyCode(sendVerifyCodeDto, res);
  }
}
