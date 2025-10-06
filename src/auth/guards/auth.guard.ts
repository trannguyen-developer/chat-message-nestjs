// import { AuthGuard } from '@nestjs/passport';
// import {
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { RedisService } from 'src/redis/redis.service';

// @Injectable()
// export class AuthenticationGuard extends AuthGuard('jwt') {
//   constructor(private readonly redisService: RedisService) {
//     super(); // Không được thay đổi hoặc ghi đè redisService ở đây
//   }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     // Gọi canActivate của AuthGuard('jwt') để xác thực JWT trước
//     const canActivate = (await super.canActivate(context)) as boolean;
//     if (!canActivate) {
//       return false;
//     }

//     // Lấy token từ request header
//     const request = context.switchToHttp().getRequest();
//     const authHeader = request.headers['authorization'];
//     if (!authHeader) {
//       throw new UnauthorizedException('Authorization header missing');
//     }

//     const token = authHeader.split(' ')[1];
//     if (!token) {
//       throw new UnauthorizedException('Token missing in Authorization header');
//     }

//     const isValid = await this?.redisService?.isTokenValid(token);
//     if (!isValid) {
//       throw new UnauthorizedException('Invalid or expired token');
//     }

//     // return true; // Token hợp lệ
//   }
// }
