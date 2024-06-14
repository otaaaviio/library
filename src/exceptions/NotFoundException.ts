import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(model: string) {
    super(`${model} not found`, HttpStatus.NOT_FOUND);
  }
}
