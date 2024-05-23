import {ExceptionFilter, Catch, ArgumentsHost} from '@nestjs/common';
import {Prisma} from '@prisma/client';
import {Response} from 'express';

@Catch(Error)
export class ErrorHandlerMiddleware implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();


        let message = 'An error occurred';
        let statusCode = 500;

        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            switch (exception.code) {
                case 'P2025':
                    message = 'Record not found';
                    statusCode = 404;
                    break;
                case 'P2003':
                    message = 'Record already exists';
                    statusCode = 400;
                    break;
                case 'P2002':
                    message = `Unique constraint failed on the fields: ${(exception.meta.target as string[]).join(', ')}`;
                    statusCode = 400;
                    break;
                case 'P2010':
                    message = 'Related record not found';
                    statusCode = 404;
                    break;
                default:
                    break;
            }
        } else {
            message = exception.message;
        }

        response.status(statusCode).json({
            statusCode: statusCode,
            message: message,
        });
    }
}