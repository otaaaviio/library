import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Logger,
    Put,
    Query,
    Res,
    Req,
    HttpStatus,
} from '@nestjs/common';
import {PaginationQueryParams} from '../utils/validation';
import {CreateReviewDto, EditReviewDto} from './reviews.validation';
import {ReviewsService} from './reviews.service';
import {plainToClass} from 'class-transformer';

@Controller('reviews')
export class ReviewsController {
    private logger = new Logger(ReviewsController.name);

    constructor(private readonly reviewsService: ReviewsService) {
    }

    @Post()
    async create(@Body() data: CreateReviewDto, @Res() res, @Req() req) {
        data = plainToClass(CreateReviewDto, data);
        try {
            const review = await this.reviewsService.create(data, Number(req.user.id));
            return res
                .status(HttpStatus.CREATED)
                .send({message: 'Review created successfully', review: review});
        } catch (err) {
            this.logger.error(`Failed to create review:\n ${err}`);
            throw err;
        }
    }

    @Get()
    async findAll(@Query() params: PaginationQueryParams) {
        params = plainToClass(PaginationQueryParams, params);
        try {
            return this.reviewsService.findAll(params);
        } catch (err) {
            this.logger.error(`Failed to get reviews:\n ${err}`);
            throw err;
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res) {
        try {
            const review = await this.reviewsService.findOne(Number(id));
            return res.status().json(review);
        } catch (err) {
            this.logger.error(`Failed to get review:\n ${err}`);
            throw err;
        }
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: EditReviewDto,
        @Res() res,
        @Req() req,
    ) {
        try {
            const review = await this.reviewsService.update(Number(id), data, req.user);
            return res
                .status(HttpStatus.OK)
                .send({message: 'Review updated successfully', review});
        } catch (err) {
            this.logger.error(`Failed to update review:\n ${err}`);
            throw err;
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Res() res, @Req() req) {
        try {
            await this.reviewsService.remove(Number(id), req.user);
            return res
                .status(HttpStatus.OK)
                .send({message: `Review with ID ${id} deleted successfully`});
        } catch (err) {
            this.logger.error(`Failed to delete review:\n ${err}`);
            throw err;
        }
    }
}
