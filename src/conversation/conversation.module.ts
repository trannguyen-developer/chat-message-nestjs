import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Participant } from './entities/participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Participant])],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
