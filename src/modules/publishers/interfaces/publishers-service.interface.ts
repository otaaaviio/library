import { CreateOrEditPublisherValidation } from '../publishers.validation';
import { PublisherDto } from '../dto/publisher.dto';
import { Request } from 'express';

export interface PublishersServiceInterface {
  createPublisher(
    data: CreateOrEditPublisherValidation,
    user_id: number,
  ): Promise<PublisherDto>;

  findAllPublishers(): Promise<PublisherDto[]>;

  findOnePublisher(id: number): Promise<PublisherDto>;

  updatePublisher(
    id: number,
    data: CreateOrEditPublisherValidation,
    user: Request['user'],
  ): Promise<PublisherDto>;

  deletePublisher(id: number, user: Request['user']): Promise<void>;
}
