import { Injectable, Inject } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { verifyOwnership } from '../utils/utils';
import { CreateOrEditAuthorValidation } from './authors.validation';
import { Request } from 'express';
import { NotFoundException } from '../../exceptions/NotFoundException';
import { AuthorsRepositoryInterface } from './interfaces/authors-repository.interface';
import { AuthorDto } from './dto/author.dto';
import { AuthorDetailedDto } from './dto/author-detailed.dto';
import { AuthorsServiceInterface } from './interfaces/authors-service.interface';

@Injectable()
export class AuthorsService implements AuthorsServiceInterface {
  constructor(
    private readonly redis: RedisService,
    @Inject('AuthorsRepositoryInterface') private readonly repository: AuthorsRepositoryInterface
  ) {}

  async createAuthor(data: CreateOrEditAuthorValidation, user_id: number): Promise<AuthorDto> {
    const author: AuthorDto = await this.repository.createAuthor(data, user_id);

    await this.redis.del('authors');

    return author;
  }

  async findAllAuthors(): Promise<AuthorDto[]> {
    const redis_key = 'authors';

    const cached_data = await this.redis.get(redis_key);

    if (cached_data) return JSON.parse(cached_data);

    const authors: AuthorDto[] = await this.repository.findAllAuthors();

    this.redis.set(redis_key, JSON.stringify(authors));

    return authors;
  }

  async findOneAuthor(id: number): Promise<AuthorDetailedDto> {
    const author: AuthorDetailedDto = await this.repository.findOneAuthor(id);

    if (!author) throw new NotFoundException('Author');

    return author;
  }

  async updateAuthor(id: number, data: CreateOrEditAuthorValidation, user: Request['user']): Promise<AuthorDto> {
    const author = await this.findOneAuthor(id);

    verifyOwnership(author, user);

    const author_updated = await this.repository.updateAuthor(id, data, user);

    await this.redis.del('authors');

    return author_updated;
  }

  async deleteAuthor(id: number, user: Request['user']): Promise<void> {
    const author = await this.findOneAuthor(id);

    verifyOwnership(author, user);

    await this.repository.deleteAuthor(id);

    await this.redis.del('authors');
  }
}
