import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationMember } from './entities/conversation_member.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, ConversationMember, Message]),
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
