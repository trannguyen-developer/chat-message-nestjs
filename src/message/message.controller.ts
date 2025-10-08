import { Body, Controller, Post, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { SentMessagePrivateDto } from './dto/message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('sent-private')
  createConversation(
    @Body() sentMessagePrivateDto: SentMessagePrivateDto,
    @Req() req,
  ) {
    return this.messageService.sendMessagePrivate(
      sentMessagePrivateDto,
      req.user,
    );
  }
}
