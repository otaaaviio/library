import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import {Prisma} from '@prisma/client';
import {Response} from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class ErrorPrismaHandlerMiddleware implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let message = 'An error occurred';
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        switch (exception.code) {
            case 'P2003':
                message = 'Record already exists';
                statusCode = HttpStatus.BAD_REQUEST;
                break;
            case 'P2002':
                message = `Unique constraint failed on the fields: ${(exception.meta.target as string[]).join(', ')}`;
                statusCode = HttpStatus.BAD_REQUEST;
                break;
            case 'P2010':
                message = 'Related record not found';
                statusCode = HttpStatus.NOT_FOUND;
                break;
            default:
                break;
        }

        response.status(statusCode).json({
            status: statusCode,
            message: message,
        });
    }
}
