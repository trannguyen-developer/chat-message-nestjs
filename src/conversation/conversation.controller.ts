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
// import { AuthenticationGuard } from 'src/auth/guards/auth.guard';

@Controller('conversation')
// @UseGuards(AuthenticationGuard)
export class ConversationController {
  private readonly conversationService: ConversationService;
  constructor(conversationService: ConversationService) {
    this.conversationService = conversationService;
  }

  @Get('')
  getConversation(@Req() req, @Res() res) {
    return this.conversationService.getConversation(req, res);
  }

  @Post('')
  createConversation(
    @Body() getConversationDTO: GetConversationDto,
    @Res() res,
  ) {
    return this.conversationService.getConversation(getConversationDTO, res);
  }
}
