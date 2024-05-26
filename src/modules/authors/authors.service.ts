import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { PaginationQueryParams } from '../utils/validation';
import { paginate, validateFilters } from '../utils/utils';
import { CreateOrEditAuthorDto } from './authors.validation';
import { Request } from 'express';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private countAuthors = async (whereClause: any): Promise<number> => {
    return this.prisma.author.count({
      where: whereClause,
    });
  };

  async create(data: CreateOrEditAuthorDto, user_id: number) {
    const author = this.prisma.author.create({
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

    this.redis.del('authors:*');

    return author;
  }

  async findAll(p: PaginationQueryParams) {
    validateFilters(p.filter, ['name']);

    const redis_key = `authors:page:${p.page}:where:${p.filter}:orderBy:${p.order_by}:itemsPerPage:${p.items_per_page}`;

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

    const total_data = await this.countAuthors(whereClause);

    const data = await this.prisma.author.findMany({
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
    return this.prisma.author.findUnique({
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

  async update(id: number, data: CreateOrEditAuthorDto, user: Request['user']) {
    const author = await this.prisma.author.findUnique({
      where: {
        id: id,
        deleted_at: null,
      },
    });

    if (!author) throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    if (author.created_by !== user.id && !user.is_admin)
      throw new HttpException('You are not allowed to update this author', HttpStatus.UNAUTHORIZED);

    const author_updated = this.prisma.author.update({
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

    this.redis.del('authors:*');

    return author_updated;
  }

  async remove(id: number, user: Request['user']) {
    const author = await this.prisma.author.findUnique({
      where: {
        id: id,
        deleted_at: null,
      },
    });

    if (!author) throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    if (author.created_by !== user.id && !user.is_admin)
      throw new HttpException('You are not allowed to delete this author', HttpStatus.UNAUTHORIZED);

    const author_deleted = this.prisma.author.update({
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

    this.redis.del('authors:*');

    return author_deleted;
  }
}
