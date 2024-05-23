import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['token'];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const { user_id } = this.jwtService.verify(token);

    const user = await this.prisma.user.findUnique({ where: { id: user_id } });

    return user.is_admin
      ? next()
      : res.status(401).json({ message: 'Unauthorized' });
  }
}
