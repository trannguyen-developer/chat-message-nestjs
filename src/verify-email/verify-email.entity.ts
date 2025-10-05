import { User } from 'src/auth/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class VerifyEmail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.verify, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  verify_code: string;

  @Column({
    type: 'timestamp',
    default: () => "CURRENT_TIMESTAMP + interval '5 minutes'",
  })
  expired_time: Date;
}
