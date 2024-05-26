import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Error)
export class ErrorHandlerMiddleware implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'An error occurred';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2025':
          message = 'Record not found';
          statusCode = HttpStatus.NOT_FOUND;
          break;
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
    } else if (exception instanceof HttpException) {
      message = exception.getResponse()['message'] ?? exception.message;
      statusCode = exception.getStatus();
    }

    response.status(statusCode).json({
      status: statusCode,
      message: message,
    });
  }
}
