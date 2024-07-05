import { CreateOrEditPublisherValidation } from '../publishers.validation';
import { PublisherDto } from '../dto/publisher.dto';
import { Request } from 'express';

export interface PublishersServiceInterface {
  create(data: CreateOrEditPublisherValidation, user_id: number): Promise<PublisherDto>;

  findAll(): Promise<PublisherDto[]>;

  findOne(id: number): Promise<PublisherDto>;

  update(id: number, data: CreateOrEditPublisherValidation, user: Request['user']): Promise<PublisherDto>;

  remove(id: number, user: Request['user']): Promise<void>;
}
