import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {RedisService} from '../redis/redis.service';
import {PaginationQueryParams} from './validation';
import {paginate, validateFilters} from './utils';
import {Request} from "express";

@Injectable()
export abstract class BaseService {
    protected constructor(
        protected readonly prisma: PrismaService,
        protected readonly redis: RedisService,
    ) {
    }

    protected abstract countEntities(whereClause: any): Promise<number>;
    protected abstract createEntity(data: any, user_id: number): Promise<any>;
    protected abstract updateEntity(id: number, data: any, user: Request['user']): Promise<any>;
    protected abstract removeEntity(id: number, user: Request['user']): Promise<any>;

    async create(data: any, user_id: number) {
        const entity = await this.createEntity(data, user_id);
        this.redis.del(`${this.constructor.name.toLowerCase()}s:*`);
        return entity;
    }

    async findAll(p: PaginationQueryParams) {
        validateFilters(p.filter, ['name']);

        const redis_key = `${this.constructor.name.toLowerCase()}s:page:${p.page}:where:${p.filter}:orderBy:${p.order_by}:itemsPerPage:${p.items_per_page}`;

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

        const total_data = await this.countEntities(whereClause);

        const data = await this.prisma[this.constructor.name.toLowerCase()].findMany({
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

    async update(id: number, data: any, user: Request['user']) {
        const entity_updated = await this.updateEntity(id, data, user);
        this.redis.del(`${this.constructor.name.toLowerCase()}s:*`);
        return entity_updated;
    }

    async remove(id: number, user: Request['user']) {
        const entity_deleted = await this.removeEntity(id, user);
        this.redis.del(`${this.constructor.name.toLowerCase()}s:*`);
        return entity_deleted;
    }
}