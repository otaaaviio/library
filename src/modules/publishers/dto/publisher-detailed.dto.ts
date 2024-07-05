import { BookDto } from '../../books/dto/book.dto';

export class PublisherDetailedDto {
  public id: number;
  public name: string;
  public books: BookDto[];
  public createdById: number;

  constructor(id: number, name: string, books: BookDto[], createdById: number) {
    this.id = id;
    this.name = name;
    this.books = books;
    this.createdById = createdById;
  }
}