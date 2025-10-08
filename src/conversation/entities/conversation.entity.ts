import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypeConversationEnum } from '../constants/conversation.enum';
import { User } from 'src/auth/user.entity';
import { ConversationMember } from './conversation_member.entity';
import { Message } from '../../message/entities/message.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: TypeConversationEnum.PRIVATE })
  type: TypeConversationEnum;

  @ManyToOne(() => User, (user) => user.createdConversation, { eager: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(
    () => ConversationMember,
    (conversationMember) => conversationMember.conversation,
  )
  members: ConversationMember[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
