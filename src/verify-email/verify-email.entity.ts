import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VerifyEmail {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  verify_code: string;
  @Column({
    type: 'timestamp',
    default: () => "CURRENT_TIMESTAMP + interval '5 minutes'",
  })
  expired_time: Date;
}
