import { User } from 'src/auth/user.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  content: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.id)
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.id)
  sender: User;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  created_time: Date;
}
