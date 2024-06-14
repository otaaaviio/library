import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {RedisService} from '../redis/redis.service';
import {PaginationQueryParams} from '../utils/validation';

@Injectable()
export class UserBooksService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {
    }

    async create(book_id: number, user_id: number) {
        const user_book = await this.prisma.userBook.create({
            data: {
                Book: {
                    connect: {id: book_id}
                },
                User: {
                    connect: {id: user_id}
                }
            },
        });

        await this.redis.del('userBooks');

        return user_book;
    }

    async findAll(user_id: number) {
        const redis_key = 'userBooks';

        const cached_data = await this.redis.get(redis_key);

        if (cached_data) return JSON.parse(cached_data);

        const data = await this.prisma.userBook.findMany({
            where: {
                user_id: user_id
            },
            select: {
                Book: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                is_read: true,
            },
        });

        await this.redis.set(redis_key, JSON.stringify(data));

        return data;
    }

    async update(book_id: number, user_id: number, is_read: boolean) {
        const user_book = await this.prisma.userBook.update({
            where: {
                user_id_book_id: {
                    user_id: user_id,
                    book_id: book_id,
                }
            },
            data: {
                is_read: is_read,
            },
        });

        await this.redis.del('userBooks');

        return user_book;
    }

    async remove(book_id: number, user_id: number) {
        const user_book = await this.prisma.userBook.delete({
            where: {
                user_id_book_id: {
                    user_id: user_id,
                    book_id: book_id,
                }
            }
        });

        await this.redis.del('userBooks');

        return user_book;
    }
}
