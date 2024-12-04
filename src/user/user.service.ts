import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';

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

      const { id, email, username, google_name, picture } = user;

      return {
        success: true,
        data: { userId: id, email, username, googleName: google_name, picture },
      };
    } catch (error) {
      throw new HttpException('Username not found', HttpStatus.NOT_FOUND);
    }
  }

  async searchUser(authorization, searchKey: string, res: Response) {
    const token = authorization.split(' ')?.[1];
    const decodedJwtAccessToken = this.jwtService.decode(token);

    try {
      const users = await this.usersRepository
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.username',
          'user.email',
          'user.google_name',
          'user.picture',
        ])
        .where('user.username LIKE :searchKey', { searchKey: `%${searchKey}%` })
        .andWhere('user.email LIKE :searchKey', { searchKey: `%${searchKey}%` })
        .andWhere('user.email != :excludedEmail', {
          excludedEmail: decodedJwtAccessToken?.email,
        })
        .getMany();

      console.log('decodedJwtAccessToken?.email', decodedJwtAccessToken?.email);

      return res.json({ success: true, data: users });
    } catch (error) {
      throw new HttpException(
        'Internal server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
