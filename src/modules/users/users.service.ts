import {HttpException, Injectable} from '@nestjs/common';
import {CreateUserDto, UpdateUserDto} from './user.validation';
import {PrismaService} from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {RedisService} from '../redis/redis.service';
import {PaginationQueryParams} from '../utils/validation';
import {paginate, validateFilters} from '../utils/utils';
import {Request} from "express";
import {CreateOrEditUserSelect, FindOneUserSelect} from "./users.select";

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {
    }

    private countUsers = async (whereClause: any): Promise<number> => {
        return this.prisma.user.count({
            where: whereClause,
        });
    };

    async create(data: CreateUserDto) {
        const hashed_pass = bcrypt.hashSync(data.password, 10);
        const user = this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashed_pass,
            },
            select: CreateOrEditUserSelect,
        });

        await this.redis.del('users:*');

        return user;
    }

    async findAll(p: PaginationQueryParams) {
        validateFilters(p.filter, ['name']);

        const redis_key = `users:page:${p.page}:where:${p.filter}:orderBy:${p.order_by}:itemsPerPage:${p.items_per_page}`;

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

        const total_data = await this.countUsers(whereClause);

        const data = await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
            },
            where: whereClause,
            take: p.items_per_page,
            skip: p.items_per_page * (p.page - 1),
        });

        const paginated_data = paginate(data, total_data, p);

        await this.redis.set(redis_key, JSON.stringify(paginated_data));

        return paginated_data;
    }

    async findOne(id: number) {
        return this.prisma.user.findUnique({
            where: {
                id: id,
                deleted_at: null,
            },
            select: FindOneUserSelect,
        });
    }

    async update(id: number, data: UpdateUserDto) {
        if (data.password) data.password = bcrypt.hashSync(data.password, 10);

        const user_updated = this.prisma.user.update({
            where: {
                id: id,
                deleted_at: null,
            },
            data: data,
            select: CreateOrEditUserSelect,
        });

        await this.redis.del('users:*');

        return user_updated;
    }

    async remove(id: number, auth_user: Request['user']) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
                deleted_at: null,
            },
        });

        if (!user) throw new HttpException('User not found', 404);
        if (id !== auth_user.id && !auth_user.is_admin) throw new HttpException('You are not allowed to delete this user', 403);

        await this.prisma.user.update({
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

        await this.redis.del('users:*');
    }
}
