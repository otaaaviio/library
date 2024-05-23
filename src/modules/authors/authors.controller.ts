import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Logger,
    HttpException,
    Put, Res,
} from '@nestjs/common';
import {PaginationQueryParams} from '../utils/validation';
import {CreateOrEditAuthor} from "./authors.validation";
import {AuthorsService} from "./authors.service";

@Controller('authors')
export class AuthorsController {
    private logger = new Logger(AuthorsController.name);

    constructor(private readonly authorsService: AuthorsService) {
    }

    @Post()
    async create(@Body() data: CreateOrEditAuthor, @Res() res) {
        try {
            const author = await this.authorsService.create(data);
            return res.status(201).send({message: 'Author created successfully', author: author});
        } catch (err) {
            this.logger.error(`Failed to create author: ${err}`);
            throw new HttpException(err?.meta.cause || 'An error occurred', 400);
        }
    }

    @Get()
    findAll(@Body() params: PaginationQueryParams) {
        try {
            return this.authorsService.findAll(params);
        } catch (err) {
            this.logger.error(`Failed to get authors: ${err}`);
            throw new HttpException(err?.meta.cause || 'An error occurred', 400);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res) {
        try {
            const author = await this.authorsService.findOne(Number(id));
            return author ?? res.status(404).send({message: 'Author not found'});
        } catch (err) {
            this.logger.error(`Failed to get author: ${err}`);
            throw new HttpException(err?.meta.cause || 'An error occurred', 400);
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: CreateOrEditAuthor, @Res() res) {
        try {
            const author = await this.authorsService.update(Number(id), data);
            return res.status(200).send({message: 'Author updated successfully', author});
        } catch (err) {
            this.logger.error(`Failed to update author: ${err}`);
            throw new HttpException(err?.meta.cause || 'An error occurred', 400);
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Res() res) {
        try {
            await this.authorsService.remove(Number(id));
            return res.status(200).send({message: `Author with ID ${id} deleted successfully`});
        } catch (err) {
            this.logger.error(`Failed to delete author: ${err}`);
            throw new HttpException(err?.meta.cause || 'An error occurred', 400);
        }
    }
}
