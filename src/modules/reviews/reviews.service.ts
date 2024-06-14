import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {RedisService} from '../redis/redis.service';
import {PaginationQueryParams} from '../utils/validation';
import {getWhereClause, paginate, validateFilters, verifyOwnership} from '../utils/utils';
import {CreateReviewDto, EditReviewDto} from './reviews.validation';
import {Request} from 'express';
import {
    CreateOrEditReviewSelect,
    FindAllReviewSelect,
    FindOneReviewSelect,
} from './reviews.select';
import {NotFoundException} from "../../exceptions/NotFoundException";

@Injectable()
export class ReviewsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {
    }

    private countReviews = async (whereClause: any): Promise<number> => {
        return this.prisma.review.count({
            where: whereClause,
        });
    };

    async create(data: CreateReviewDto, user_id: number) {
        const review = await this.prisma.review.create({
            data: {
                Book: {
                    connect: {
                        id: data.book_id,
                    },
                },
                rating: data.rating,
                comment: data.comment,
                CreatedBy: {
                    connect: {
                        id: user_id,
                    },
                },
                UpdatedBy: {
                    connect: {
                        id: user_id,
                    },
                },
            },
            select: CreateOrEditReviewSelect,
        });

        const keys = await this.redis.keys('reviews:*');
        for (const key of keys) {
            await this.redis.del(key);
        }

        return review;
    }

    async findAll(p: PaginationQueryParams) {
        validateFilters(p.filters, ['rating', 'created_by', 'book_id']);

        const redis_key = `reviews:page:${p.page}:where:${p.filters || 'all'}:orderBy:${p.order_by || 'none'}:itemsPerPage:${p.items_per_page}`;

        const cached_data = await this.redis.get(redis_key);

        if (cached_data) return JSON.parse(cached_data);

        const whereClause = getWhereClause(p.filters);

        const [total_data, data] = await Promise.all([
            this.countReviews(whereClause),
            this.prisma.review.findMany({
                select: FindAllReviewSelect,
                where: whereClause,
                take: p.items_per_page,
                skip: p.items_per_page * (p.page - 1),
            }),
        ]);

        const paginated_data = paginate(data, total_data, p);

        this.redis.set(redis_key, JSON.stringify(paginated_data));

        return paginated_data;
    }

    async findOne(id: number) {
        const review = await this.prisma.review.findUnique({
            where: {
                id: id,
                deleted_at: null,
            },
            select: FindOneReviewSelect,
        });

        if (!review) throw new NotFoundException('Review');

        return review;
    }

    async update(id: number, data: EditReviewDto, user: Request['user']) {
        const review = await this.findOne(id);

        verifyOwnership(review, user);

        const review_updated = await this.prisma.review.update({
            where: {
                id: id,
                deleted_at: null,
            },
            data: {
                ...data,
                UpdatedBy: {
                    connect: {
                        id: user.id,
                    },
                },
            },
            select: CreateOrEditReviewSelect,
        });

        const keys = await this.redis.keys('reviews:*');
        for (const key of keys) {
            await this.redis.del(key);
        }

        return review_updated;
    }

    async remove(id: number, user: Request['user']) {
        const review = await this.findOne(id);

        verifyOwnership(review, user);

        const review_deleted = await this.prisma.review.update({
            where: {
                id: id,
                deleted_at: null,
            },
            data: {
                deleted_at: new Date(),
            },
            select: {
                id: true,
            },
        });

        const keys = await this.redis.keys('reviews:*');
        for (const key of keys) {
            await this.redis.del(key);
        }

        return review_deleted;
    }
}
