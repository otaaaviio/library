import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {RedisService} from '../redis/redis.service';
import {PaginationQueryParams} from '../utils/validation';
import {getWhereClause, paginate, validateFilters} from '../utils/utils';
import {CreateOrEditPublisherDto} from './publishers.validation';
import {Request} from 'express';

@Injectable()
export class PublishersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {
    }

    private countPublishers = async (whereClause: any): Promise<number> => {
        return this.prisma.publisher.count({
            where: whereClause,
        });
    };

    async create(data: CreateOrEditPublisherDto, user_id: number) {
        const publisher = this.prisma.publisher.create({
            data: {
                name: data.name,
                CreatedBy: {
                    connect: {
                        id: user_id,
                    },
                },
            },
            select: {
                id: true,
                name: true,
            },
        });

        await this.redis.del('publishers:*');

        return publisher;
    }

    async findAll(p: PaginationQueryParams) {
        validateFilters(p.filters, ['name']);

        const redis_key = `publishers:page:${p.page}:where:${JSON.stringify(p.filters)}:orderBy:${p.order_by}:itemsPerPage:${p.items_per_page}`;

        const cached_data = await this.redis.get(redis_key);

        if (cached_data) return JSON.parse(cached_data);

        const whereClause = getWhereClause(p.filters);

        const total_data = await this.countPublishers(whereClause);

        const data = await this.prisma.publisher.findMany({
            select: {
                id: true,
                name: true,
            },
            where: whereClause,
            take: p.items_per_page,
            skip: p.items_per_page * (p.page - 1),
        });

        const paginated_data = paginate(data, total_data, p);

        this.redis.set(redis_key, JSON.stringify(paginated_data));

        return paginated_data;
    }

    async findOne(id: number) {
        return this.prisma.publisher.findUnique({
            where: {
                id: id,
                deleted_at: null,
            },
            select: {
                id: true,
                name: true,
                Books: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
    }

    async update(
        id: number,
        data: CreateOrEditPublisherDto,
        user: Request['user'],
    ) {
        const publisher = await this.prisma.publisher.findUnique({
            where: {
                id: id,
                deleted_at: null,
            },
        });

        if (!publisher)
            throw new HttpException('Publisher not found', HttpStatus.NOT_FOUND);
        if (publisher.created_by !== user.id && !user.is_admin)
            throw new HttpException(
                'You are not allowed to update this publisher',
                HttpStatus.UNAUTHORIZED,
            );

        const publisher_updated = this.prisma.publisher.update({
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
            select: {
                id: true,
                name: true,
            },
        });

        await this.redis.del('publishers:*');

        return publisher_updated;
    }

    async remove(id: number, user: Request['user']) {
        const publisher = await this.prisma.publisher.findUnique({
            where: {
                id: id,
                deleted_at: null,
            },
        });

        if (!publisher)
            throw new HttpException('Publisher not found', HttpStatus.NOT_FOUND);
        if (publisher.created_by !== user.id && !user.is_admin)
            throw new HttpException(
                'You are not allowed to delete this publisher',
                HttpStatus.UNAUTHORIZED,
            );

        const publisher_deleted = this.prisma.publisher.update({
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

        await this.redis.del('publishers:*');

        return publisher_deleted;
    }
}
