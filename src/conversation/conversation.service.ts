import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationMember } from './entities/conversation_member.entity';
import { Message } from './entities/message.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ConversationService {
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

  async getConversation(req) {
    try {
      const userInfo = req?.user;
      const emailReq = userInfo?.email;

      const user = await this.userRepository.findOne({
        where: { email: emailReq },
        relations: ['conversationMember', 'conversationMember.conversation'],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const conversations = user.conversationMember.map(
        (member) => member.conversation,
      );
      console.log('conversations', conversations);

      return { success: true, data: conversations };
    } catch (error) {
      throw new HttpException(
        'Some thing went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
