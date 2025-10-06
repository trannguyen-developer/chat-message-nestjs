import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from 'src/auth/user.entity';
import { RoleRoomEnum } from '../constants';

@Entity()
export class ConversationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.conversationMember, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: RoleRoomEnum.MEMBER })
  role: RoleRoomEnum;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  joinedAt: Date;
}
