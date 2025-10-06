import { UserProfile } from 'src/user-profile/entities/user-profile.entity';
import { ResetPassword } from '../reset-password/reset-password.entity';
import { VerifyEmail } from '../verify-email/verify-email.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GoogleAccount } from 'src/google-account/entities/google-account.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { ConversationMember } from 'src/conversation/entities/conversation_member.entity';
import { Message } from 'src/conversation/entities/message.entity';

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

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToOne(() => VerifyEmail, (verifyEmail) => verifyEmail.user, {
    cascade: true,
  })
  verify: VerifyEmail;

  @OneToOne(() => ResetPassword, (resetPassword) => resetPassword.user, {
    cascade: true,
  })
  resetPW: ResetPassword;

  @OneToOne(() => ResetPassword, (resetPassword) => resetPassword.user, {
    cascade: true,
  })
  googleAccount: GoogleAccount;

  @OneToMany(() => Conversation, (conversation) => conversation.created_by)
  createdConversation: Conversation[];

  @OneToMany(
    () => ConversationMember,
    (conversationMember) => conversationMember.user,
  )
  conversationMember: ConversationMember[];

  @OneToMany(() => Message, (message) => message.sender)
  message: Message[];

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
