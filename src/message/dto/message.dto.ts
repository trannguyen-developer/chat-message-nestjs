import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { MessageTypeEnum } from '../constants';

export class SentMessagePrivateDto {
  @IsUUID()
  @IsNotEmpty()
  public recipientId: string;

  @IsString()
  @IsNotEmpty()
  public content: string;

  public type?: MessageTypeEnum;
}
