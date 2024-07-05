import { AuthorDto } from '../dto/author.dto';
import { CreateOrEditAuthorValidation } from '../authors.validation';
import { Request } from 'express';
import { AuthorDetailedDto } from '../dto/author-detailed.dto';

export interface AuthorsServiceInterface {
  createAuthor(data: CreateOrEditAuthorValidation, user_id: number): Promise<AuthorDto>;

  findAllAuthors(): Promise<AuthorDto[]>;

  findOneAuthor(id: number): Promise<AuthorDetailedDto>;

  updateAuthor(id: number, data: CreateOrEditAuthorValidation, user: Request['user']): Promise<AuthorDto>;

  deleteAuthor(id: number, user: Request['user']): Promise<void>;
}