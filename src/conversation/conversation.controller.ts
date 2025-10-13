import { Body, Controller, Post, Req, Get } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { GetConversationDto } from './dto/conversation.dto';

@Controller('')
export class ConversationController {
  private readonly conversationService: ConversationService;
  constructor(conversationService: ConversationService) {
    this.conversationService = conversationService;
  }

  @Get('conversations')
  getConversation(@Req() req) {
    return this.conversationService.getConversation(req);
  }

  @Post('conversation')
  createConversation(@Body() getConversationDTO: GetConversationDto) {
    return this.conversationService.getConversation(getConversationDTO);
  }
}
