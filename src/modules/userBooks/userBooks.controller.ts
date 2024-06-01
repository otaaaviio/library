import {
    Controller,
    Post,
    Logger,
    Res,
    Get,
    Body,
    HttpStatus,
    Query,
    Req,
    HttpException,
} from '@nestjs/common';
import {UserBooksService} from "./userBooks.service";
import {UserBookDto} from "./userBooks.validation";
import {PaginationQueryParams} from "../utils/validation";
import {plainToClass} from 'class-transformer';

@Controller('userBooks')
export class UserBooksController {
    private logger = new Logger(UserBooksController.name);

    constructor(private readonly userBooksService: UserBooksService) {
    }

    @Post()
    async handleAction(
        @Body() body: UserBookDto,
        @Res() res,
        @Req() req
    ) {
        try {
            let response;
            switch (body.action) {
                case 'create':
                    response = await this.userBooksService.create(body.book_id, req.user.id);
                    break;
                case 'update':
                    response = await this.userBooksService.update(body.book_id, req.user.id);
                    break;
                case 'delete':
                    response = await this.userBooksService.remove(body.book_id, req.user.id);
                    break;
                default:
                    return new HttpException('Invalid action', HttpStatus.BAD_REQUEST);
            }
            return res.status(200).json({message: body.action + ' successfully', response});
        } catch (err) {
            this.logger.error(`Failed to ${body.action}:\n ${err}`);
            throw err;
        }
    }

    @Get()
    async getListOfBooks(@Query() params: PaginationQueryParams, @Res() res, @Req() req) {
        params = plainToClass(PaginationQueryParams, params);
        try {
            const response = await this.userBooksService.findAll(params, req.user.id);
            return res.status(200).json(response);
        } catch (err) {
            this.logger.error(`Failed to get response:\n ${err}`);
            throw err;
        }
    }
}
