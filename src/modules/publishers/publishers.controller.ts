import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  Put,
  Res,
  Inject,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { CreateOrEditPublisherValidation } from './publishers.validation';
import { PublishersServiceInterface } from './interfaces/publishers-service.interface';

@Controller('publishers')
export class PublishersController {
  private logger = new Logger(PublishersController.name);

  constructor(
    @Inject('PublishersServiceInterface')
    private readonly service: PublishersServiceInterface,
  ) {}

  @Post()
  async create(
    @Body() data: CreateOrEditPublisherValidation,
    @Res() res,
    @Req() req,
  ) {
    try {
      const publisher = await this.service.createPublisher(data, Number(req.user.id));
      return res.status(HttpStatus.CREATED).send({
        message: 'Publisher created successfully',
        publisher: publisher,
      });
    } catch (err) {
      this.logger.error(`Failed to create publisher:\n ${err}`);
      throw err;
    }
  }

  @Get()
  async findAll() {
    try {
      return this.service.findAllPublishers();
    } catch (err) {
      this.logger.error(`Failed to get publishers:\n ${err}`);
      throw err;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const publisher = await this.service.findOnePublisher(Number(id));
      return res.status(HttpStatus.OK).json(publisher);
    } catch (err) {
      this.logger.error(`Failed to get publisher:\n ${err}`);
      throw err;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: CreateOrEditPublisherValidation,
    @Res() res,
    @Req() req,
  ) {
    try {
      const publisher = await this.service.updatePublisher(Number(id), data, req.user);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Publisher updated successfully', publisher });
    } catch (err) {
      this.logger.error(`Failed to update publisher:\n ${err}`);
      throw err;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res, @Req() req) {
    try {
      await this.service.deletePublisher(Number(id), req.user);
      return res
        .status(HttpStatus.OK)
        .send({ message: `Publisher with ID ${id} deleted successfully` });
    } catch (err) {
      this.logger.error(`Failed to delete publisher:\n ${err}`);
      throw err;
    }
  }
}
