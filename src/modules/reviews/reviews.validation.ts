import { IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

class CreateReviewDto {
  @Min(1)
  book_id: number;

  @Max(5)
  @Min(0)
  rating: number;

  @IsNotEmpty()
  comment: string;
}

class EditReviewDto {
  @IsOptional()
  @Max(5)
  @Min(0)
  rating: number;

  @IsOptional()
  @IsNotEmpty()
  comment: string;
}

export { CreateReviewDto, EditReviewDto };
