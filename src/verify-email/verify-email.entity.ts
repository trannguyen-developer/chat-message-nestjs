import { User } from 'src/auth/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class VerifyEmail {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // @OneToOne(() => User)
  // @JoinColumn({ name: 'user_id' })
  // user: User;
  @Column()
  verify_code: string;
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_time: Date;
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  expired_time: Date;
}
