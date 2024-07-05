import { AuthorDto } from '../dto/author.dto';
import { CreateOrEditAuthorValidation } from '../authors.validation';
import { AuthorDetailedDto } from '../dto/author-detailed.dto';
import { Request } from 'express';

export interface AuthorsRepositoryInterface {
  createAuthor(data: CreateOrEditAuthorValidation, user_id: number): Promise<AuthorDto>;

  findOneAuthor(id: number): Promise<AuthorDetailedDto>;

  findAllAuthors(): Promise<AuthorDto[]>;

  updateAuthor(id: number, data: CreateOrEditAuthorValidation, user: Request['user']): Promise<AuthorDto>;

  deleteAuthor(id: number): Promise<void>;
}