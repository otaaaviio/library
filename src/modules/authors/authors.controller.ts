import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  Inject,
  Put,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { CreateOrEditAuthorValidation } from './authors.validation';
import { AuthorsServiceInterface } from './interfaces/authors-service.interface';

@Controller('authors')
export class AuthorsController {
  private logger: Logger;

  constructor(
    @Inject('AuthorsServiceInterface')
    private readonly service: AuthorsServiceInterface,
  ) {
    this.logger = new Logger(AuthorsController.name);
  }

  @Post()
  async create(
    @Body() data: CreateOrEditAuthorValidation,
    @Res() res,
    @Req() req,
  ) {
    try {
      const author = await this.service.createAuthor(data, Number(req.user.id));
      return res
        .status(HttpStatus.CREATED)
        .send({ message: 'Author created successfully', author: author });
    } catch (err) {
      this.logger.error(`Failed to create author:\n ${err}`);
      throw err;
    }
  }

  @Get()
  async findAll() {
    try {
      return this.service.findAllAuthors();
    } catch (err) {
      this.logger.error(`Failed to get authors:\n ${err}`);
      throw err;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const author = await this.service.findOneAuthor(Number(id));
      return res.status(HttpStatus.OK).json(author);
    } catch (err) {
      this.logger.error(`Failed to get author:\n ${err}`);
      throw err;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: CreateOrEditAuthorValidation,
    @Res() res,
    @Req() req,
  ) {
    try {
      const author = await this.service.updateAuthor(
        Number(id),
        data,
        req.user,
      );
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Author updated successfully', author });
    } catch (err) {
      this.logger.error(`Failed to update author:\n ${err}`);
      throw err;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res, @Req() req) {
    try {
      await this.service.deleteAuthor(Number(id), req.user);
      return res
        .status(HttpStatus.OK)
        .send({ message: `Author with ID ${id} deleted successfully` });
    } catch (err) {
      this.logger.error(`Failed to delete author:\n ${err}`);
      throw err;
    }
  }
}
