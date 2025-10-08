import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { ConversationMember } from 'src/conversation/entities/conversation_member.entity';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { SentMessagePrivateDto } from './dto/message.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

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
  ) {
    try {
      console.log('sentMessagePrivateDto', sentMessagePrivateDto);
      console.log('currentUser', currentUser);
      const { recipientId, content } = sentMessagePrivateDto;
      const currentUserId = currentUser?.id;
      if (currentUserId === recipientId) {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }

      const existingConversation = await this.conversationRepository
        .createQueryBuilder('conversation')
        .innerJoin('conversation.members', 'user')
        .where('user.user_id IN (:...userIds)', {
          userIds: [recipientId, currentUserId],
        })
        .groupBy('conversation.id')
        .having('COUNT(DISTINCT user.user_id) = 2')
        .getOne();
      console.log('existingConversation', existingConversation);

      let conversation = existingConversation;

      if (!conversation) {
        conversation = this.conversationRepository.create();
        await this.conversationRepository.save(conversation);

        const members = [
          this.conversationMemberRepository.create({
            conversation,
            user: { id: currentUserId },
          }),
          this.conversationMemberRepository.create({
            conversation,
            user: { id: recipientId },
          }),
        ];

        await this.conversationMemberRepository.save(members);
      }
      const message = this.messageRepository.create({
        conversation,
        sender: { id: currentUserId },
        content,
      });

      await this.messageRepository.save(message);

      return {
        conversationId: conversation?.id,
        message,
      };
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  }
}
