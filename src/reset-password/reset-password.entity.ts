import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ResetPassword {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  token: string;
  @Column({
    type: 'timestamp',
    default: () => "CURRENT_TIMESTAMP + interval '60 minutes'",
  })
  expired_time: Date;
}
