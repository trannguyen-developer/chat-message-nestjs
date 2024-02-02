import {
  IsString,
  IsDefined,
  Length,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsDefined()
  @IsString()
  @Length(5, 20)
  @IsNotEmpty()
  public username: string;

  @IsDefined()
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  public password: string;

  @IsDefined()
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  public confirmPassword: string;
}
