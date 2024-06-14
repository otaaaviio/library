import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.validation';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../redis/redis.service';
import { PaginationQueryParams } from '../utils/validation';
import {
  getWhereClause,
  paginate, sortedStringify,
  validateFilters,
} from '../utils/utils';
import { Request } from 'express';
import { CreateOrEditUserSelect, FindOneUserSelect } from './users.select';
import { NotFoundException } from '../../exceptions/NotFoundException';
import { NotAllowedException } from '../../exceptions/NotAllowedException';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private countUsers = async (whereClause: any): Promise<number> => {
    return this.prisma.user.count({
      where: whereClause,
    });
  };

  async create(data: CreateUserDto) {
    const hashed_pass = bcrypt.hashSync(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashed_pass,
      },
      select: CreateOrEditUserSelect,
    });

    const keys = await this.redis.keys('users:*');
    for (const key of keys) {
      await this.redis.del(key);
    }

    return user;
  }

  async findAll(p: PaginationQueryParams) {
    validateFilters(p.filters, ['name']);

    const redis_key = `users:page:${p.page}:where:${sortedStringify(p.filters) || 'all'}:orderBy:${sortedStringify(p.order_by) || 'none'}:itemsPerPage:${p.items_per_page}`;

    const cached_data = await this.redis.get(redis_key);

    if (cached_data) return JSON.parse(cached_data);

    const whereClause = getWhereClause(p.filters);

    const [total_data, data] = await Promise.all([
      this.countUsers(whereClause),
      this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
        },
        where: whereClause,
        take: p.items_per_page,
        skip: p.items_per_page * (p.page - 1),
      }),
    ]);

    const paginated_data = paginate(data, total_data, p);

    await this.redis.set(redis_key, JSON.stringify(paginated_data));

    return paginated_data;
  }

  async findOne(id: number) {
    const user = this.prisma.user.findUnique({
      where: {
        id: id,
        deleted_at: null,
      },
      select: FindOneUserSelect,
    });

    if (!user) throw new NotFoundException('User');

    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    if (data.password) data.password = bcrypt.hashSync(data.password, 10);

    const user_updated = await this.prisma.user.update({
      where: {
        id: id,
        deleted_at: null,
      },
      data: data,
      select: CreateOrEditUserSelect,
    });

    const keys = await this.redis.keys('users:*');
    for (const key of keys) {
      await this.redis.del(key);
    }

    return user_updated;
  }

  async remove(id: number, auth_user: Request['user']) {
    await this.findOne(id);

    if (id !== auth_user.id && !auth_user.is_admin)
      throw new NotAllowedException();

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

    const keys = await this.redis.keys('users:*');
    for (const key of keys) {
      await this.redis.del(key);
    }
  }
}
