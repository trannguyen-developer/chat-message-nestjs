import {
  IsString,
  IsDefined,
  IsNotEmpty,
  IsEmail,
  Length,
} from 'class-validator';

export class SendEmailDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}

export class ResetPasswordDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  public token: string;

  @IsDefined()
  @IsString()
  @Length(5, 20)
  @IsNotEmpty()
  public password: string;

  @IsDefined()
  @IsString()
  @Length(5, 20)
  @IsNotEmpty()
  public confirmPassword: string;
}
