import { UserProfile } from 'src/user-profile/entities/user-profile.entity';
import { ResetPassword } from '../reset-password/reset-password.entity';
import { VerifyEmail } from '../verify-email/verify-email.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GoogleAccount } from 'src/google-account/entities/google-account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ nullable: true, default: false })
  is_verify: boolean;
  @Column({ nullable: true, default: false })
  is_google_account: boolean;
  @Column({ nullable: true })
  refresh_token: string;
  // @OneToOne(() => VerifyEmail, { cascade: true, eager: true })
  // @JoinColumn({ name: 'verify_id', referencedColumnName: 'id' })
  // verify: VerifyEmail;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @OneToOne(() => VerifyEmail, (verifyEmail) => verifyEmail.user)
  verify: VerifyEmail;

  // @OneToOne(() => ResetPassword, { cascade: true, eager: true })
  // @JoinColumn({ name: 'reset_pw_id', referencedColumnName: 'id' })
  // resetPW: ResetPassword;

  @OneToOne(() => ResetPassword, (resetPassword) => resetPassword.user)
  resetPW: ResetPassword;

  @OneToOne(() => ResetPassword, (resetPassword) => resetPassword.user)
  googleAccount: GoogleAccount;

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
  updated_time: Date;
}
