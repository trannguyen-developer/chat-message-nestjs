import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async getInfo(authorization) {
    const token = authorization.split(' ')?.[1];
    const decodedJwtAccessToken = this.jwtService.decode(token);

    try {
      const user = await this.usersRepository.findOneBy({
        email: decodedJwtAccessToken.email,
      });

      const { id, email, username } = user;

      return { success: true, data: { userId: id, email, username } };
    } catch (error) {
      throw new HttpException('Username not found', HttpStatus.NOT_FOUND);
    }
  }
}
