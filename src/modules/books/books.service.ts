import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { PaginationQueryParams } from '../utils/validation';
import {
  getWhereClause,
  paginate, sortedStringify,
  validateFilters,
  verifyOwnership,
} from '../utils/utils';
import { CreateBookDto } from './books.validation';
import { Request } from 'express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  CreateOrEditBookSelect,
  FindAllBookSelect,
  FindOneBookSelect,
} from './books.select';
import { NotFoundException } from '../../exceptions/NotFoundException';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  private countBooks = async (whereClause: any): Promise<number> => {
    return this.prisma.book.count({
      where: whereClause,
    });
  };

  async create(data: CreateBookDto, user_id: number) {
    const imageUrls = await Promise.all(
      data.images.map(async (image, index) => {
        const public_id = `${data.title.replace(/[^a-zA-Z0-9]/g, '')}_${index}`;
        return await this.cloudinary.uploadImage(image, public_id);
      }),
    );

    const book = await this.prisma.book.create({
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
          create: imageUrls.map((url) => ({
            image_path: url,
          })),
        },
      },
      select: CreateOrEditBookSelect,
    });

    const keys = await this.redis.keys('books:*');
    for (const key of keys) {
      await this.redis.del(key);
    }

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

    const redis_key = `books:page:${p.page}:where:${sortedStringify(p.filters) || 'all'}:orderBy:${sortedStringify(p.order_by) || 'none'}:itemsPerPage:${p.items_per_page}`;

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
        image_path: item.Images[0]?.image_path,
        author: item.Author.name,
        category: item.Category.name,
      });
      return acc;
    }, []);

    const DataWithReviewInfo = await Promise.all(
      DataReduced.map(async (book) => {
        const reviewInfo = await this.prisma.review.aggregate({
          where: { book_id: book.id },
          _count: true,
          _avg: {
            rating: true,
          },
        });

        return {
          ...book,
          review_count: reviewInfo._count,
          avg_rating: reviewInfo._avg.rating,
        };
      }),
    );

    const paginated_data = paginate(DataWithReviewInfo, total_data, p);

    this.redis.set(redis_key, JSON.stringify(paginated_data));

    return paginated_data;
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: {
        id: id,
        deleted_at: null,
      },
      select: FindOneBookSelect,
    });

    if (!book) throw new NotFoundException('Book');

    const reviewInfo = await this.prisma.review.aggregate({
      where: { book_id: book.id },
      _count: true,
      _avg: {
        rating: true,
      },
    });

    return {
      ...book,
      review_count: reviewInfo._count,
      avg_rating: reviewInfo._avg.rating,
    };
  }

  async update(id: number, data: CreateBookDto, user: Request['user']) {
    const book = await this.findOne(id);

    let imageUrls: string[] = [];

    verifyOwnership(book, user);

    if (!!data.images)
      await this.prisma.bookImage.deleteMany({
        where: {
          Book: {
            id: id,
          },
        },
      });

    if (!!data.images)
      imageUrls = await Promise.all(
        data.images.map(async (image, index) => {
          const public_id = `${data.title.replace(/[^a-zA-Z0-9]/g, '')}_${index}`;
          return await this.cloudinary.uploadImage(image, public_id);
        }),
      );

    const updateData: any = Object.keys(data).reduce((obj, key) => {
      if (data[key]) {
        if (['publisher_id', 'author_id', 'category_id'].includes(key)) {
          const newKey = key.replace('_id', '');
          obj[newKey.charAt(0).toUpperCase() + newKey.slice(1)] = {
            connect: {
              id: data[key],
            },
          };
        } else if (key === 'images' && data[key]) {
          obj[key.charAt(0).toUpperCase() + key.slice(1)] = {
            create: imageUrls.map((url) => ({
              image_path: url,
            })),
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

    const keys = await this.redis.keys('books:*');
    for (const key of keys) {
      await this.redis.del(key);
    }

    return book_updated;
  }

  async remove(id: number, user: Request['user']) {
    const book = await this.findOne(id);

    verifyOwnership(book, user);

    const book_deleted = await this.prisma.book.update({
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

    const keys = await this.redis.keys('books:*');
    for (const key of keys) {
      await this.redis.del(key);
    }

    return book_deleted;
  }
}
