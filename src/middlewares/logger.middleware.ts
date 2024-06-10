import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
      private readonly jwtService: JwtService,
  ) {}

  private logger = new Logger('HTTP');

  private async getUserIdFromToken(token: string): Promise<number | null> {
    return (await this.jwtService.verify(token)).user_id;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl, user } = req;

    // some routes not require authentication, so no have req.user
    let user_id = null;
    if(!user) {
      const token = req.cookies['token'];
      if(token) {
        user_id = await this.getUserIdFromToken(token);
      }
    }

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(
        `[${method}] ${originalUrl} - user_id: ${user?.id ?? user_id} - ${duration}ms`,
      );
    });

    next();
  }
}
