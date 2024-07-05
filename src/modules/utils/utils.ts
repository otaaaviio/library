import { PaginationQueryParams } from './validation';
import { InvalidFilterException } from '../../exceptions/InvalidFilterException';
import { Request } from 'express';
import { NotAllowedException } from '../../exceptions/NotAllowedException';

interface IFilter {
  field: string;
  value: string | number;
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

  filters.map((key) => {
    if (!allowedFilters.includes(key.field)) {
      throw new InvalidFilterException(key.field);
    }

    if (key.field.endsWith('_id') || key.field.endsWith('_by')) {
      key.value = Number(key.value);
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
    if (filter)
      if (filter.field.endsWith('_id') || filter.field.endsWith('_by')) {
        whereClause[filter.field] = Number(filter.value);
      } else {
        whereClause[filter.field] =
          typeof filter.value === 'string'
            ? {
                contains: filter.value.toLowerCase(),
                mode: 'insensitive',
              }
            : {
                contains: filter.value,
              };
      }
  }

  return whereClause;
}

function verifyOwnership(model: any, user: Request['user']) {
  if (model.CreatedBy?.id !== user.id && !user.is_admin)
    throw new NotAllowedException();
}

function sortedStringify(obj) {
  if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
  return JSON.stringify(
    Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        result[key] = sortedStringify(obj[key]);
        return result;
      }, {}),
  );
}

export {
  paginate,
  validateFilters,
  getWhereClause,
  verifyOwnership,
  sortedStringify,
};
