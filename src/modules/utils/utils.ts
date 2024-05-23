import { PaginationQueryParams } from './validation';

function paginate(data: any, count_total: number, p: PaginationQueryParams) {
  const total_pages = Math.ceil(count_total / p.items_per_page) || 1;

  return {
    data: data,
    pagination: {
      page: p.page,
      per_page: p.items_per_page,
      total: count_total,
      total_pages: total_pages,
    },
  };
}

function validateFilters(filters: any, allowedFilters: string[]): void {
  if (!filters) return;

  Object.keys(filters).forEach((key) => {
    if (!allowedFilters.includes(key)) {
      throw new Error(`Invalid filter: ${key}`);
    }

    filters[key] = {
      contains: filters[key],
      mode: 'insensitive',
    };
  });
}

export { paginate, validateFilters };
