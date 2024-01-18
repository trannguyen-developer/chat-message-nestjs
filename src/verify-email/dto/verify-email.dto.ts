import {
  IsString,
  IsDefined,
  IsNotEmpty,
  IsEmail,
  Length,
} from 'class-validator';

export class VerifyCodeDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}

export class SendVerifyCodeDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  public code: string;
}
