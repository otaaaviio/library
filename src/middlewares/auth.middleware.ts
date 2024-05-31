import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../modules/prisma/prisma.service';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        email: string;
        is_admin: boolean;
      } | null;
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['token'];

    if (!token) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    try {
      const { user_id } = await this.jwtService.verify(token);

      req.user = (await this.prisma.user.findUnique({
        where: {
          id: user_id,
        },
        select: {
          id: true,
          email: true,
          is_admin: true,
        },
      })) as any;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    next();
  }
}
