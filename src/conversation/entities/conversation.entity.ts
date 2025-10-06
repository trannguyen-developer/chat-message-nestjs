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
import { Message } from './message.entity';

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
  created_by: User;

  @OneToMany(
    () => ConversationMember,
    (conversationMember) => conversationMember.conversation,
  )
  members: ConversationMember[];

  @OneToMany(() => Message, (message) => message.conversation_id)
  messages: Message[];

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
