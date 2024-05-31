import { PaginationQueryParams } from './validation';

interface IFilter {
  field: string;
  value: string;
}

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

function validateFilters(filters: IFilter[], allowedFilters: string[]): void {
  if (!filters) return;

  Object.keys(filters).forEach((key) => {
    if (!allowedFilters.includes(key)) {
      throw new Error(`Invalid filter: ${key}`);
    }
  });
  return;
}

function getWhereClause(filters?: IFilter[]) {
  const whereClause = {
    deleted_at: null,
  };

  if (!Array.isArray(filters)) return whereClause;

  for (const filter of filters) {
    if (filter) {
      whereClause[filter.field] = {
        contains: filter.value,
      };
    }
  }

  return whereClause;
}

export { paginate, validateFilters, getWhereClause };
