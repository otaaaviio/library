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
    Req,
    HttpStatus,
} from '@nestjs/common';
import {CreateOrEditAuthorDto} from './authors.validation';
import {AuthorsService} from './authors.service';

@Controller('authors')
export class AuthorsController {
    private logger = new Logger(AuthorsController.name);

    constructor(private readonly authorsService: AuthorsService) {
    }

    @Post()
    async create(@Body() data: CreateOrEditAuthorDto, @Res() res, @Req() req) {
        try {
            const author = await this.authorsService.create(data, Number(req.user.id));
            return res
                .status(HttpStatus.CREATED)
                .send({message: 'Author created successfully', author: author});
        } catch (err) {
            this.logger.error(`Failed to create author:\n ${err}`);
            throw err;
        }
    }

    @Get()
    async findAll() {
        try {
            return this.authorsService.findAll();
        } catch (err) {
            this.logger.error(`Failed to get authors:\n ${err}`);
            throw err;
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res) {
        try {
            const author = await this.authorsService.findOne(Number(id));
            return res.status(HttpStatus.OK).json(author);
        } catch (err) {
            this.logger.error(`Failed to get author:\n ${err}`);
            throw err;
        }
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: CreateOrEditAuthorDto,
        @Res() res,
        @Req() req,
    ) {
        try {
            const author = await this.authorsService.update(Number(id), data, req.user);
            return res
                .status(HttpStatus.OK)
                .send({message: 'Author updated successfully', author});
        } catch (err) {
            this.logger.error(`Failed to update author:\n ${err}`);
            throw err;
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Res() res, @Req() req) {
        try {
            await this.authorsService.remove(Number(id), req.user);
            return res
                .status(HttpStatus.OK)
                .send({message: `Author with ID ${id} deleted successfully`});
        } catch (err) {
            this.logger.error(`Failed to delete author:\n ${err}`);
            throw err;
        }
    }
}
