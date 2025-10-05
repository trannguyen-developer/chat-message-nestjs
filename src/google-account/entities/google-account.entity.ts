import { User } from 'src/auth/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class GoogleAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  google_name: string;

  @Column({ nullable: true })
  picture: string;

  @OneToOne(() => User, (user) => user.googleAccount, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
