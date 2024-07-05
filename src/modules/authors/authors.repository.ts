import { AuthorDto } from './dto/author.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrEditAuthorValidation } from './authors.validation';
import { AuthorsRepositoryInterface } from './interfaces/authors-repository.interface';
import { AuthorDetailedDto } from './dto/author-detailed.dto';
import { Request } from 'express';

export class AuthorsRepository implements AuthorsRepositoryInterface {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  async createAuthor(
    data: CreateOrEditAuthorValidation,
    user_id: number,
  ): Promise<AuthorDto> {
    const new_author = await this.prisma.author.create({
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

    return new AuthorDto(new_author.id, new_author.name);
  }

  async findOneAuthor(id: number): Promise<AuthorDetailedDto | null> {
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
            id: true,
          },
        },
      },
    });

    if (!author) return null;

    return new AuthorDetailedDto(
      author.id,
      author.name,
      author.Books,
      author.CreatedBy.id,
    );
  }

  async findAllAuthors(): Promise<AuthorDto[]> {
    const authors = await this.prisma.author.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        deleted_at: null,
      },
    });

    return authors.map((author) => new AuthorDto(author.id, author.name));
  }

  async updateAuthor(
    id: number,
    data: CreateOrEditAuthorValidation,
    user: Request['user'],
  ): Promise<AuthorDto> {
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

    return new AuthorDto(author_updated.id, author_updated.name);
  }

  async deleteAuthor(id: number): Promise<void> {
    await this.prisma.author.update({
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
