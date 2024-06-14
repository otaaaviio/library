import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  Logger,
  Put,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { PaginationQueryParams } from '../utils/validation';
import { CreateBookDto, EditBookDto } from './books.validation';
import { BooksService } from './books.service';
import { plainToClass } from 'class-transformer';

@Controller('books')
export class BooksController {
  private logger = new Logger(BooksController.name);

  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() data: CreateBookDto, @Res() res, @Req() req) {
    try {
      const book = await this.booksService.create(data, Number(req.user.id));
      return res
        .status(HttpStatus.CREATED)
        .send({ message: 'Book created successfully', book: book });
    } catch (err) {
      this.logger.error(`Failed to create book:\n ${err}`);
      throw err;
    }
  }

  @Get()
  async findAll(@Query() params: PaginationQueryParams) {
    params = plainToClass(PaginationQueryParams, params);
    try {
      return this.booksService.findAll(params);
    } catch (err) {
      this.logger.error(`Failed to get books:\n ${err}`);
      throw err;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const book = await this.booksService.findOne(Number(id));
      return res.status(HttpStatus.OK).json(book);
    } catch (err) {
      this.logger.error(`Failed to get book:\n ${err}`);
      throw err;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: EditBookDto,
    @Res() res,
    @Req() req,
  ) {
    try {
      const book = await this.booksService.update(Number(id), data, req.user);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Book updated successfully', book });
    } catch (err) {
      this.logger.error(`Failed to update book:\n ${err}`);
      throw err;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res, @Req() req) {
    try {
      await this.booksService.remove(Number(id), req.user);
      return res
        .status(HttpStatus.OK)
        .send({ message: `Book with ID ${id} deleted successfully` });
    } catch (err) {
      this.logger.error(`Failed to delete book:\n ${err}`);
      throw err;
    }
  }
}
