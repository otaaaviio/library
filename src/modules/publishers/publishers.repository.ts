import { PrismaService } from '../prisma/prisma.service';
import { PublishersRepositoryInterface } from './interfaces/publishers-repository.interface';
import { CreateOrEditPublisherValidation } from './publishers.validation';
import { PublisherDto } from './dto/publisher.dto';
import { PublisherDetailedDto } from './dto/publisher-detailed.dto';

export class PublishersRepository implements PublishersRepositoryInterface {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  async createPublisher(
    data: CreateOrEditPublisherValidation,
    user_id: number,
  ): Promise<PublisherDto> {
    const new_publisher = await this.prisma.publisher.create({
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

    return new PublisherDto(new_publisher.id, new_publisher.name);
  }

  async findAllPublishers(): Promise<PublisherDto[]> {
    const publishers = await this.prisma.publisher.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        deleted_at: null,
      },
    });

    return publishers.map(
      (publisher) => new PublisherDto(publisher.id, publisher.name),
    );
  }

  async findOnePublisher(id: number): Promise<PublisherDetailedDto | null> {
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
            id: true,
          },
        },
      },
    });

    if (!publisher) return null;

    return new PublisherDetailedDto(
      publisher.id,
      publisher.name,
      publisher.Books.map((book) => ({
        id: book.id,
        title: book.title,
      })),
      publisher.CreatedBy.id,
    );
  }

  async updatePublisher(
    id: number,
    data: CreateOrEditPublisherValidation,
    user_id: number,
  ): Promise<PublisherDto> {
    const publisher_updated = await this.prisma.publisher.update({
      where: {
        id: id,
        deleted_at: null,
      },
      data: {
        ...data,
        UpdatedBy: {
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

    return new PublisherDto(publisher_updated.id, publisher_updated.name);
  }

  async deletePublisher(id: number): Promise<void> {
    await this.prisma.publisher.update({
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
  }
}
