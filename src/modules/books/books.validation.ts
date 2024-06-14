import { IsNotEmpty, IsOptional, Min } from 'class-validator';

class CreateBookDto {
  @IsNotEmpty()
  title: string;

  @Min(1)
  publisher_id: number;

  @Min(1)
  author_id: number;

  @IsNotEmpty()
  @Min(1)
  category_id: number;

  @IsOptional()
  @IsNotEmpty()
  description: string;

  published_at: Date;

  @IsNotEmpty()
  images: string[];
}

class EditBookDto extends CreateBookDto {
  @IsOptional()
  title: string;

  @IsOptional()
  publisher_id: number;

  @IsOptional()
  author_id: number;

  @IsOptional()
  category_id: number;

  @IsOptional()
  published_at: Date;

  @IsOptional()
  images: string[];
}

export { CreateBookDto, EditBookDto };
