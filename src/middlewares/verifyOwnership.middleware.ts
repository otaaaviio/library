import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import {PrismaService} from '../modules/prisma/prisma.service';

@Injectable()
export class VerifyOwnershipMiddleware implements NestMiddleware {
    constructor(private readonly prisma: PrismaService) {
    }

    async use(req: Request, res: Response, next: NextFunction) {
        // const record_id = Number(req.params.id);
        //
        // if(req.user.is_admin) next();
        //
        // if (record_id) {
        //     if (req.user.id !== record_id) {
        //         return res.status(403).json({
        //             message: 'You do not have permission to perform this action'
        //         });
        //     }
        // }

        next();
    }
}
