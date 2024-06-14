import {
  Controller,
  Post,
  Logger,
  Res,
  Get,
  Body,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { UserBooksService } from './userBooks.service';
import { UserBookDto } from './userBooks.validation';
import { InvalidActionException } from '../../exceptions/InvalidActionException';

@Controller('userBooks')
export class UserBooksController {
  private logger = new Logger(UserBooksController.name);

  constructor(private readonly userBooksService: UserBooksService) {}

  @Post()
  async handleAction(@Body() body: UserBookDto, @Res() res, @Req() req) {
    try {
      let response;
      switch (body.action) {
        case 'create':
          response = await this.userBooksService.create(
            body.book_id,
            req.user.id,
          );
          break;
        case 'update':
          response = await this.userBooksService.update(
            body.book_id,
            req.user.id,
            body.is_read,
          );
          break;
        case 'delete':
          response = await this.userBooksService.remove(
            body.book_id,
            req.user.id,
          );
          break;
        default:
          return new InvalidActionException();
      }
      return res
        .status(HttpStatus.OK)
        .json({ message: body.action + ' successfully', response });
    } catch (err) {
      this.logger.error(`Failed to ${body.action}:\n ${err}`);
      throw err;
    }
  }

  @Get()
  async getListOfBooks(@Res() res, @Req() req) {
    try {
      const response = await this.userBooksService.findAll(req.user.id);
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      this.logger.error(`Failed to get response:\n ${err}`);
      throw err;
    }
  }
}
