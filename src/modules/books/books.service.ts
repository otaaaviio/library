import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { PaginationQueryParams } from '../utils/validation';
import { paginate, validateFilters } from '../utils/utils';
import { CreateBookDto } from './books.validation';
import { Request } from 'express';
import {
  CreateOrEditBookSelect,
  FindAllBookSelect,
  FindOneBookSelect,
} from './books.select';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private countBooks = async (whereClause: any): Promise<number> => {
    return this.prisma.book.count({
      where: whereClause,
    });
  };

  async create(data: CreateBookDto, user_id: number) {
    const book = this.prisma.book.create({
      data: {
        title: data.title,
        image_url: data.image_url,
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
      },
      select: CreateOrEditBookSelect,
    });

    this.redis.del('books:*');

    return book;
  }

  async findAll(p: PaginationQueryParams) {
    validateFilters(p.filter, [
      'title',
      'author_id',
      'category_id',
      'publisher_id',
      'published_at',
    ]);

    const redis_key = `books:page:${p.page}:where:${p.filter}:orderBy:${p.order_by}:itemsPerPage:${p.items_per_page}`;

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

    const total_data = await this.countBooks(whereClause);

    const data = await this.prisma.book.findMany({
      select: FindAllBookSelect,
      where: whereClause,
      take: p.items_per_page,
      skip: p.items_per_page * (p.page - 1),
    });

    const paginated_data = paginate(data, total_data, p);

    this.redis.set(redis_key, JSON.stringify(paginated_data));

    return paginated_data;
  }

  async findOne(id: number) {
    return this.prisma.book.findUnique({
      where: {
        id: id,
        deleted_at: null,
      },
      select: FindOneBookSelect,
    });
  }

  async update(id: number, data: CreateBookDto, user: Request['user']) {
    const book = await this.prisma.book.findUnique({
      where: {
        id: id,
        deleted_at: null,
      },
    });

    if (!book) throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    if (book.created_by !== user.id && !user.is_admin)
      throw new HttpException(
        'You are not allowed to update this book',
        HttpStatus.UNAUTHORIZED,
      );

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
    const book = await this.prisma.book.findUnique({
      where: {
        id: id,
        deleted_at: null,
      },
    });

    if (!book) throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    if (book.created_by !== user.id && !user.is_admin)
      throw new HttpException(
        'You are not allowed to delete this book',
        HttpStatus.UNAUTHORIZED,
      );

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
