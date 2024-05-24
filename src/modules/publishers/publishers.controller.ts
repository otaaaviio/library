import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Logger,
    Put, Res, Req,
} from '@nestjs/common';
import {PaginationQueryParams} from '../utils/validation';
import {CreateOrEditPublisherDto} from "./publishers.validation";
import {PublishersService} from "./publishers.service";

@Controller('publishers')
export class PublishersController {
    private logger = new Logger(PublishersController.name);

    constructor(private readonly publishersService: PublishersService) {
    }

    @Post()
    async create(@Body() data: CreateOrEditPublisherDto, @Res() res, @Req() req) {
        try {
            const publisher = await this.publishersService.create(data, Number(req.user.id));
            return res.status(201).send({message: 'Publisher created successfully', publisher: publisher});
        } catch (err) {
            this.logger.error(`Failed to create publisher:\n ${err}`);
            throw err;
        }
    }

    @Get()
    async findAll(@Body() params: PaginationQueryParams) {
        try {
            return this.publishersService.findAll(params);
        } catch (err) {
            this.logger.error(`Failed to get publishers:\n ${err}`);
            throw err;
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res) {
        try {
            const publisher = await this.publishersService.findOne(Number(id));
            if (publisher) return res.status(200).json(publisher);
            return res.status(404).send({message: 'Publisher not found'});
        } catch (err) {
            this.logger.error(`Failed to get publisher:\n ${err}`);
            throw err;
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: CreateOrEditPublisherDto, @Res() res, @Req() req) {
        try {
            const publisher = await this.publishersService.update(Number(id), data, req.user);
            return res.status(200).send({message: 'Publisher updated successfully', publisher});
        } catch (err) {
            this.logger.error(`Failed to update publisher:\n ${err}`);
            throw err;
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Res() res, @Req() req) {
        try {
            await this.publishersService.remove(Number(id), req.user);
            return res.status(200).send({message: `Publisher with ID ${id} deleted successfully`});
        } catch (err) {
            this.logger.error(`Failed to delete publisher:\n ${err}`);
            throw err;
        }
    }
}
