import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidFilterException extends HttpException {
  constructor(filter: string) {
    super(`Invalid filter: ${filter}`, HttpStatus.BAD_REQUEST);
  }
}
