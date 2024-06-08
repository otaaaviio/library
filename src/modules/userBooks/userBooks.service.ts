import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {RedisService} from '../redis/redis.service';
import {PaginationQueryParams} from '../utils/validation';
import { paginate, validateFilters} from '../utils/utils';
import {Request} from 'express';

@Injectable()
export class UserBooksService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {
    }

    private countRegisters = async (whereClause: any): Promise<number> => {
        return this.prisma.userBook.count({
            where: whereClause,
        });
    };

    async create(book_id: number, user_id: number) {
        const user_book = this.prisma.userBook.create({
            data: {
                Book: {
                    connect: { id: book_id}
                },
                User: {
                    connect: { id: user_id}
                }
            },
        });

        await this.redis.del('userBooks:*');

        return user_book;
    }

    async findAll(p: PaginationQueryParams, user_id: number) {
        validateFilters(p.filters, ['book_title']);

        const redis_key = `userBooks:page:${p.page}:where:${JSON.stringify(p.filters)}:orderBy:${p.order_by}:itemsPerPage:${p.items_per_page}`;

        const cached_data = await this.redis.get(redis_key);

        if (cached_data) return JSON.parse(cached_data);

        const whereClause = {
            user_id: user_id
        };
        
        if(Array.isArray(p.filters))
            for (const filter of p.filters) {
                if (filter.field === 'book_title') {
                    whereClause['Book'] = {
                        title: {
                            contains: filter.value,
                        },
                    };
                }
            }

        const [total_data, data] = await Promise.all([
            await this.countRegisters(whereClause),
            this.prisma.userBook.findMany({
                select: {
                    Book: {
                        select: {
                            id: true,
                            title: true
                        }
                    },
                    is_read: true,
                },
                where: whereClause ?? null,
                take: p.items_per_page,
                skip: p.items_per_page * (p.page - 1),
            }),
        ]);

        const paginated_data = paginate(data, total_data, p);

        this.redis.set(redis_key, JSON.stringify(paginated_data));

        return paginated_data;
    }

    async update(book_id: number, user_id: number) {
        const user_book = await this.prisma.userBook.update({
            where: {
                user_id_book_id: {
                    user_id: user_id,
                    book_id: book_id,
                }
            },
            data: {
                is_read: true,
            },
        });

        await this.redis.del('userBooks:*');

        return user_book;
    }

    async remove(book_id: number, user_id: number) {
        const user_book = this.prisma.userBook.delete({
            where: {
                user_id_book_id: {
                    user_id: user_id,
                    book_id: book_id,
                }
            }
        });

        await this.redis.del('userBooks:*');

        return user_book;
    }
}
