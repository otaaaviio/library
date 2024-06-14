import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {RedisService} from '../redis/redis.service';
import {verifyOwnership} from '../utils/utils';
import {CreateOrEditAuthorDto} from './authors.validation';
import {Request} from 'express';
import {NotFoundException} from "../../exceptions/NotFoundException";

@Injectable()
export class AuthorsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {
    }

    async create(data: CreateOrEditAuthorDto, user_id: number) {
        const author = await this.prisma.author.create({
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

        await this.redis.del('authors');

        return author;
    }

    async findAll() {
        const redis_key = 'authors';

        const cached_data = await this.redis.get(redis_key);

        if (cached_data) return JSON.parse(cached_data);

        const data = await this.prisma.author.findMany({
            select: {
                id: true,
                name: true,
            },
            where: {
                deleted_at: null,
            }
        });

        this.redis.set(redis_key, JSON.stringify(data));

        return data;
    }

    async findOne(id: number) {
        const author = await this.prisma.author.findUnique({
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
                CreatedBy: {
                    select: {
                        id: true
                    },
                }
            },
        });

        if (!author) throw new NotFoundException('Author');

        return author;
    }

    async update(id: number, data: CreateOrEditAuthorDto, user: Request['user']) {
        const author = await this.findOne(id);

        verifyOwnership(author, user);

        const author_updated = await this.prisma.author.update({
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

        await this.redis.del('authors');

        return author_updated;
    }

    async remove(id: number, user: Request['user']) {
        const author = await this.findOne(id);

        verifyOwnership(author, user);

        const author_deleted = await this.prisma.author.update({
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

        await this.redis.del('authors');

        return author_deleted;
    }
}
