import { BookDto } from '../../books/dto/book.dto';

export class AuthorDetailedDto {
  public id: number;
  public name: string;
  public Books: BookDto[];
  public CreatedById: number;

  constructor(id: number, name: string, Books: BookDto[], CreatedById: number) {
    this.id = id;
    this.name = name;
    this.Books = Books;
    this.CreatedById = CreatedById;
  }
}