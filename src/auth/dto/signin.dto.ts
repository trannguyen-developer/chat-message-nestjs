import { IsString, IsDefined, IsNotEmpty, IsEmail } from 'class-validator';

export class SignInDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  public password: string;
}
