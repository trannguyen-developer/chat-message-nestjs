import { IsString, IsDefined, Length, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @Length(3, 20)
  @IsNotEmpty()
  public username: string;

  @IsDefined()
  @IsString()
  @Length(5, 20)
  @IsNotEmpty()
  public nickname: string;

  @IsDefined()
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  public password: string;
}
