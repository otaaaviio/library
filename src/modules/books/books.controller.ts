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
import {CreateBookDto, EditBookDto} from "./books.validation";
import {BooksService} from "./books.service";

@Controller('books')
export class BooksController {
    private logger = new Logger(BooksController.name);

    constructor(private readonly booksService: BooksService) {
    }

    @Post()
    async create(@Body() data: CreateBookDto, @Res() res, @Req() req) {
        try {
            const book = await this.booksService.create(data, Number(req.user.id));
            return res.status(201).send({message: 'Book created successfully', book: book});
        } catch (err) {
            this.logger.error(`Failed to create book:\n ${err}`);
            throw err;
        }
    }

    @Get()
    async findAll(@Body() params: PaginationQueryParams) {
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
            if (book) return res.status(200).json(book);
            return res.status(404).send({message: 'Book not found'});
        } catch (err) {
            this.logger.error(`Failed to get book:\n ${err}`);
            throw err;
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: EditBookDto, @Res() res, @Req() req) {
        try {
            const book = await this.booksService.update(Number(id), data, req.user);
            return res.status(200).send({message: 'Book updated successfully', book});
        } catch (err) {
            this.logger.error(`Failed to update book:\n ${err}`);
            throw err;
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Res() res, @Req() req) {
        try {
            await this.booksService.remove(Number(id), req.user);
            return res.status(200).send({message: `Book with ID ${id} deleted successfully`});
        } catch (err) {
            this.logger.error(`Failed to delete book:\n ${err}`);
            throw err;
        }
    }
}
