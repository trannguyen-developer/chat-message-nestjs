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
  async getInfo(req, res: Response) {
    try {
      const userInfo = req?.user;
      const emailReq = userInfo?.email;

      const user = await this.usersRepository.findOne({
        relations: ['profile', 'googleAccount'],
        where: { email: emailReq },
      });

      const { id, email, profile, googleAccount } = user;
      const username = profile.username;

      return res.json({
        success: true,
        data: {
          userId: id,
          email,
          username,
          googleName: googleAccount?.google_name,
          picture: googleAccount?.picture,
        },
      });
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

      return res.json({ success: true, data: users });
    } catch (error) {
      throw new HttpException(
        'Internal server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
