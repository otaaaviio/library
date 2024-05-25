import {Injectable, Logger, NestMiddleware, UnauthorizedException,} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    async use(req: Request, res: Response, next: NextFunction) {
        const {method, originalUrl, user} = req;
        const start = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - start;
            this.logger.log(`[${method}] ${originalUrl} - user_id: ${user?.id} - ${duration}ms`
            );
        });

        next();
    }
}
