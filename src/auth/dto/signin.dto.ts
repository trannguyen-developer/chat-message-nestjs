import { IsString, IsDefined, Length, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsDefined()
  @IsString()
  @Length(3, 20)
  @IsNotEmpty()
  public email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  public password: string;
}
