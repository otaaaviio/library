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
import {CreateBookDto} from "./books.validation";
import {BooksService} from "./books.service";

@Controller('authors')
export class BooksController {
    private logger = new Logger(BooksController.name);

    constructor(private readonly authorsService: BooksService) {
    }

    @Post()
    async create(@Body() data: CreateBookDto, @Res() res, @Req() req) {
        try {
            const author = await this.authorsService.create(data, Number(req.user.id));
            return res.status(201).send({message: 'Author created successfully', author: author});
        } catch (err) {
            this.logger.error(`Failed to create author:\n ${err}`);
            throw err;
        }
    }

    @Get()
    async findAll(@Body() params: PaginationQueryParams) {
        try {
            return this.authorsService.findAll(params);
        } catch (err) {
            this.logger.error(`Failed to get authors:\n ${err}`);
            throw err;
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res) {
        try {
            const author = await this.authorsService.findOne(Number(id));
            if (author) return res.status(200).json(author);
            return res.status(404).send({message: 'Author not found'});
        } catch (err) {
            this.logger.error(`Failed to get author:\n ${err}`);
            throw err;
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: CreateBookDto, @Res() res, @Req() req) {
        try {
            const author = await this.authorsService.update(Number(id), data, req.user);
            return res.status(200).send({message: 'Author updated successfully', author});
        } catch (err) {
            this.logger.error(`Failed to update author:\n ${err}`);
            throw err;
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Res() res, @Req() req) {
        try {
            await this.authorsService.remove(Number(id), req.user);
            return res.status(200).send({message: `Author with ID ${id} deleted successfully`});
        } catch (err) {
            this.logger.error(`Failed to delete author:\n ${err}`);
            throw err;
        }
    }
}
