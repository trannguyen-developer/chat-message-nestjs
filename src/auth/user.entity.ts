import { VerifyEmail } from 'src/verify-email/verify-email.entity';
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
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true, nullable: true })
  email: string;
  @Column({ nullable: true })
  username: string;
  @Column()
  password: string;
  @Column({ nullable: true, default: false })
  is_verify: boolean;
  @Column()
  access_token: string;
  @Column()
  refresh_token: string;
  @OneToOne(() => VerifyEmail, { eager: true })
  @JoinColumn({ name: 'verify_id' })
  verify: VerifyEmail;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  created_time: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  expired_time: Date;
}
