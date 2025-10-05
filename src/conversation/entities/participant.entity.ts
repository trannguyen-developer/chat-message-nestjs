import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from 'src/auth/user.entity';
import { RoleRoomEnum } from '../constants';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true, nullable: true })
  email: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.id)
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ default: RoleRoomEnum.MEMBER })
  role: RoleRoomEnum;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  created_time: Date;
}
