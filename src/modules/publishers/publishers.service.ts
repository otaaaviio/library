import {HttpException, Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {RedisService} from '../redis/redis.service';
import {PaginationQueryParams} from '../utils/validation';
import {paginate, validateFilters} from '../utils/utils';
import {CreateOrEditPublisher} from "./publishers.validation";

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

    async create(data: CreateOrEditPublisher, user_id: number) {
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

        this.redis.del('publishers:*');

        return publisher;
    }

    async findAll(p: PaginationQueryParams) {
        validateFilters(p.filter, ['name']);

        const redis_key = `publishers:page:${p.page}:where:${p.filter}:orderBy:${p.order_by}:itemsPerPage:${p.items_per_page}`;

        const cached_data = await this.redis.get(redis_key);

        if (cached_data) return JSON.parse(cached_data);

        const whereClause = {
            deleted_at: null,
        };

        if (p.filter) {
            whereClause[p.filter.field] = {
                contains: p.filter.value,
            };
        }

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
                }
            },
        });
    }

    async update(id: number, data: CreateOrEditPublisher, user: Request['user']) {
        const publisher = await this.prisma.publisher.findUnique({
            where: {
                id: id,
                deleted_at: null,
            },
        });

        if (!publisher) throw new HttpException('Publisher not found', 404);
        if (publisher.created_by !== user.id && !user.is_admin) throw new HttpException('You are not allowed to update this publisher', 403);

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

        this.redis.del('publishers:*');

        return publisher_updated;
    }

    async remove(id: number) {
        const publisher = await this.prisma.publisher.findUnique({
            where: {
                id: id,
                deleted_at: null,
            },
        });

        if (!publisher) throw new HttpException('Publisher not found', 404);
        if (publisher.created_by !== user.id && !user.is_admin) throw new HttpException('You are not allowed to delete this publisher', 403);

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

        this.redis.del('publishers:*');

        return publisher_deleted;
    }
}
