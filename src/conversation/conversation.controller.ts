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
  Get,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { GetConversationDto } from './dto/conversation.dto';

@Controller('conversation')
export class ConversationController {
  private readonly conversationService: ConversationService;
  constructor(conversationService: ConversationService) {
    this.conversationService = conversationService;
  }

  @Get('')
  getConversation(@Req() req) {
    return this.conversationService.getConversation(req);
  }

  @Post('')
  createConversation(@Body() getConversationDTO: GetConversationDto) {
    return this.conversationService.getConversation(getConversationDTO);
  }
}
