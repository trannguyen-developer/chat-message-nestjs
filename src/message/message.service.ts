import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { ConversationMember } from 'src/conversation/entities/conversation_member.entity';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { SentMessagePrivateDto } from './dto/message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,

    @InjectRepository(ConversationMember)
    private conversationMemberRepository: Repository<ConversationMember>,

    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async sendMessagePrivate(
    sentMessagePrivateDto: SentMessagePrivateDto,
    currentUser,
  ) {}
}
