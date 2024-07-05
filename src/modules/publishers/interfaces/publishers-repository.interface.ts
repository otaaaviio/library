import { CreateOrEditPublisherValidation } from '../publishers.validation';
import { PublisherDto } from '../dto/publisher.dto';
import { PublisherDetailedDto } from '../dto/publisher-detailed.dto';

export interface PublishersRepositoryInterface {
  createPublisher(data: CreateOrEditPublisherValidation, user_id: number): Promise<PublisherDto>;

  findOnePublisher(id: number): Promise<PublisherDetailedDto | null>;

  findAllPublishers(): Promise<PublisherDto[]>;

  updatePublisher(id: number, data: CreateOrEditPublisherValidation, user_id: number): Promise<PublisherDto>;

  deletePublisher(id: number): Promise<void>;
}