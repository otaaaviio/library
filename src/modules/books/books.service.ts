import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {RedisService} from '../redis/redis.service';
import {PaginationQueryParams} from '../utils/validation';
import {getWhereClause, paginate, validateFilters} from '../utils/utils';
import {CreateBookDto} from './books.validation';
import {Request} from 'express';
import {
    CreateOrEditBookSelect,
    FindAllBookSelect,
    FindOneBookSelect
} from './books.select';

@Injectable()
export class BooksService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {
    }

    private countBooks = async (whereClause: any): Promise<number> => {
        return this.prisma.book.count({
            where: whereClause,
        });
    };

    private verifyBookOwnership = (book: any, user: Request['user']) => {
        if (book.created_by !== user.id && !user.is_admin)
            throw new HttpException(
                'You are not allowed to delete this book',
                HttpStatus.UNAUTHORIZED,
            );
    }

    async create(data: CreateBookDto, user_id: number) {
        const book = this.prisma.book.create({
            data: {
                title: data.title,
                description: data.description,
                published_at: data.published_at,
                Publisher: {
                    connect: {
                        id: data.publisher_id,
                    },
                },
                Author: {
                    connect: {
                        id: data.author_id,
                    },
                },
                Category: {
                    connect: {
                        id: data.category_id,
                    },
                },
                CreatedBy: {
                    connect: {
                        id: user_id,
                    },
                },
                Images: {
                    create: data.images.map(image => ({
                        image_path: image
                    }))
                }
            },
            select: CreateOrEditBookSelect,
        });

        this.redis.del('books:*');

        return book;
    }

    async findAll(p: PaginationQueryParams) {
        validateFilters(p.filters, [
            'title',
            'author_id',
            'category_id',
            'publisher_id',
            'published_at',
        ]);

        const redis_key = `books:page:${p.page}:where:${JSON.stringify(p.filters)}:orderBy:${p.order_by}:itemsPerPage:${p.items_per_page}`;

        const cached_data = await this.redis.get(redis_key);

        if (cached_data) return JSON.parse(cached_data);

        const whereClause = getWhereClause(p.filters);

        const [total_data, data] = await Promise.all([
            this.countBooks(whereClause),
            this.prisma.book.findMany({
                select: FindAllBookSelect,
                where: whereClause,
                take: p.items_per_page,
                skip: p.items_per_page * (p.page - 1),
            }),
        ]);

        const DataReduced = data.reduce((acc, item) => {
            acc.push({
                id: item.id,
                title: item.title,
                image_path: item.Images[0].image_path,
                author: item.Author.name,
                category: item.Category.name
            });
            return acc;
        }, []);

        const DataWithReviewInfo = await Promise.all(DataReduced.map(async book => {
            const reviewInfo = await this.prisma.review.aggregate({
                where: {book_id: book.id},
                _count: true,
                _avg: {
                    rating: true,
                },
            });

            return {
                ...book,
                review_count: reviewInfo._count,
                avg_rating: reviewInfo._avg.rating,
            }
        }));

        const paginated_data = paginate(DataWithReviewInfo, total_data, p);

        this.redis.set(redis_key, JSON.stringify(paginated_data));

        return paginated_data;
    }

    async findOne(id: number) {
        const book = this.prisma.book.findUnique({
            where: {
                id: id,
                deleted_at: null,
            },
            select: FindOneBookSelect,
        });

        if (!book) throw new HttpException('Book not found', HttpStatus.NOT_FOUND);

        return book;
    }

    async update(id: number, data: CreateBookDto, user: Request['user']) {
        const book = await this.findOne(id);

        this.verifyBookOwnership(book, user);

        const updateData: any = Object.keys(data).reduce((obj, key) => {
            if (data[key]) {
                if (['publisher_id', 'author_id', 'category_id'].includes(key)) {
                    obj[key.charAt(0).toUpperCase() + key.slice(1)] = {
                        connect: {
                            id: data[key],
                        },
                    };
                } else {
                    obj[key] = data[key];
                }
            }
            return obj;
        }, {});

        updateData.UpdatedBy = {
            connect: {
                id: user.id,
            },
        };

        const book_updated = await this.prisma.book.update({
            where: {
                id: id,
                deleted_at: null,
            },
            data: updateData,
            select: CreateOrEditBookSelect,
        });

        this.redis.del('books:*');

        return book_updated;
    }

    async remove(id: number, user: Request['user']) {
        const book = await this.findOne(id);

        this.verifyBookOwnership(book, user);

        const book_deleted = this.prisma.book.update({
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

        this.redis.del('books:*');

        return book_deleted;
    }
}
