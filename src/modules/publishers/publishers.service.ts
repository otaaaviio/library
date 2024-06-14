import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {RedisService} from '../redis/redis.service';
import {CreateOrEditPublisherDto} from './publishers.validation';
import {Request} from 'express';
import {NotFoundException} from "../../exceptions/NotFoundException";
import {verifyOwnership} from "../utils/utils";

@Injectable()
export class PublishersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {
    }

    async create(data: CreateOrEditPublisherDto, user_id: number) {
        const publisher = await this.prisma.publisher.create({
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

        await this.redis.del('publishers');

        return publisher;
    }

    async findAll() {
        const redis_key = 'publishers';

        const cached_data = await this.redis.get(redis_key);

        if (cached_data) return JSON.parse(cached_data);

        const data = await this.prisma.publisher.findMany({
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
        const publisher = await this.prisma.publisher.findUnique({
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
                    }
                }
            },
        });

        if(!publisher) throw new NotFoundException('Publisher');

        return publisher;
    }

    async update(
        id: number,
        data: CreateOrEditPublisherDto,
        user: Request['user'],
    ) {
        const publisher = await this.findOne(id);

        verifyOwnership(publisher, user)

        const publisher_updated = await this.prisma.publisher.update({
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

        await this.redis.del('publishers');

        return publisher_updated;
    }

    async remove(id: number, user: Request['user']) {
        const publisher = await this.findOne(id);

        verifyOwnership(publisher, user)

        const publisher_deleted = await this.prisma.publisher.update({
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

        await this.redis.del('publishers');

        return publisher_deleted;
    }
}
