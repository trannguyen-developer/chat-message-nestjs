import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageTypeEnum } from '../constants';
import { User } from 'src/auth/user.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({ default: MessageTypeEnum.TEXT })
  message_type: MessageTypeEnum;

  @ManyToOne(() => User, (user) => user.message, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    eager: true,
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation_id: Conversation;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
