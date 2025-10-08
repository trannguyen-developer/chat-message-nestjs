import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { ConversationMember } from 'src/conversation/entities/conversation_member.entity';
import { Message } from './entities/message.entity';
import { UserProfile } from 'src/user-profile/entities/user-profile.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Conversation,
      ConversationMember,
      Message,
      UserProfile,
    ]),
    AuthModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
