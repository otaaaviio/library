import { IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

class PaginationQueryParams {
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  page: number;

  @IsOptional()
  order_by: {
    [field: string]: 'asc' | 'desc';
  };

  @IsOptional()
  filters: {
    field: string;
    value: string;
  }[];

  @Transform(({ value }) => parseInt(value))
  @Min(1)
  items_per_page: number;
}

export { PaginationQueryParams };
