import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

declare global {
  namespace Express {
    interface Request {
      user_id: number;
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
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const { user_id } = await this.jwtService.verify(token);

      req.user_id = user_id;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    next();
  }
}
