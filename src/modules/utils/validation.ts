import { IsOptional, Min } from 'class-validator';

class PaginationQueryParams {
  @Min(1)
  page: number;

  @IsOptional()
  order_by: {
    [field: string]: 'asc' | 'desc';
  };

  @IsOptional()
  filter: {
    field: string;
    value: string;
  };

  @Min(1)
  items_per_page: number;
}

export { PaginationQueryParams };
