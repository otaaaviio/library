import { BookDto } from '../../books/dto/book.dto';

export class AuthorDetailedDto {
  public id: number;
  public name: string;
  public books: BookDto[];
  public createdById: number;

  constructor(id: number, name: string, Books: BookDto[], CreatedById: number) {
    this.id = id;
    this.name = name;
    this.books = Books;
    this.createdById = CreatedById;
  }
}
