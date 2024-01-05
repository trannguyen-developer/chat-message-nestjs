import {
  HttpException,
  HttpStatus,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDTO: SignInDto, res: Response) {
    const { username, password } = signInDTO;

    const findUser = await this.usersRepository.findOneBy({
      username,
    });

    console.log('findUser', findUser);

    if (!findUser) throw new UnauthorizedException();

    const isComparePw = bcrypt.compareSync(password, findUser.password);

    if (!isComparePw) throw new UnauthorizedException();

    const payload = { username: findUser.username };

    const accessToken = await this.jwtService.signAsync(payload);

    res.json({
      success: true,
      data: {
        access_token: accessToken,
      },
    });
  }

  async signUp(userCreateDTO: CreateUserDto): Promise<User> {
    const { username, nickname, password } = userCreateDTO;

    const userExist = await this.usersRepository.findOne({
      where: { username },
    });

    console.log('userExist', userExist);

    if (userExist) {
      throw new HttpException('Username existed', HttpStatus.CONFLICT);
    }

    // hash password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = await this.usersRepository.create({
      username,
      nickname,
      password: passwordHash,
    });

    await this.usersRepository.save(user);
    return user;
  }
}
