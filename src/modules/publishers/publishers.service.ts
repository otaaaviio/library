import { Injectable, Inject } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { CreateOrEditPublisherValidation } from './publishers.validation';
import { Request } from 'express';
import { NotFoundException } from '../../exceptions/NotFoundException';
import { verifyOwnership } from '../utils/utils';
import { PublishersRepositoryInterface } from './interfaces/publishers-repository.interface';
import { PublisherDto } from './dto/publisher.dto';
import { PublishersServiceInterface } from './interfaces/publishers-service.interface';
import { PublisherDetailedDto } from './dto/publisher-detailed.dto';

@Injectable()
export class PublishersService implements PublishersServiceInterface {
  constructor(
    private readonly redis: RedisService,
    @Inject('PublisherRepositoryInterface') private readonly repository: PublishersRepositoryInterface,
  ) {}

  async create(data: CreateOrEditPublisherValidation, user_id: number): Promise<PublisherDto> {
    const publisher = await this.repository.createPublisher(data, user_id);

    await this.redis.del('publishers');

    return publisher;
  }

  async findAll(): Promise<PublisherDto[]> {
    const redis_key = 'publishers';

    const cached_data = await this.redis.get(redis_key);

    if (cached_data) return JSON.parse(cached_data);

    const publishers = await this.repository.findAllPublishers();

    this.redis.set(redis_key, JSON.stringify(publishers));

    return publishers;
  }

  async findOne(id: number): Promise<PublisherDetailedDto> {
    const publisher = await this.repository.findOnePublisher(id);

    if (!publisher) throw new NotFoundException('Publisher');

    return publisher;
  }

  async update(
    id: number,
    data: CreateOrEditPublisherValidation,
    user: Request['user'],
  ): Promise<PublisherDto>  {
    const publisher = await this.findOne(id);

    verifyOwnership(publisher, user);

    const publisher_updated = await this.repository.updatePublisher(id, data, user.id);

    await this.redis.del('publishers');

    return publisher_updated;
  }

  async remove(id: number, user: Request['user']): Promise<void>  {
    const publisher = await this.findOne(id);

    verifyOwnership(publisher, user);

    await this.repository.deletePublisher(id);

    await this.redis.del('publishers');
  }
}
