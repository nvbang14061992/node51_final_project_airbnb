import { diskStorage } from 'multer';
import { extname } from 'path';
import { promises as fs } from 'fs';
import { QueryPaginationDto } from '../dtos/query-pagination.dto';

export const createMulterStorage = (folderPath: string) =>
  diskStorage({
    destination: folderPath,
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(
        null,
        `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
      );
    },
  });

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  await fs.unlink(filePath);
}

type FindManyAndCountModel = {
  findMany: (args?: any) => Promise<any[]>;
  count: (args?: any) => Promise<number>;
};

export interface PaginationResult<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

function getPaginationParams(query: QueryPaginationDto) {
  let { page, pageSize, filtersStringJson } = query;
  page = +page > 0 ? +page : 1; // avoid return error, for user experience
  pageSize = +pageSize > 0 ? +pageSize : 10;
  const filters = JSON.parse(filtersStringJson || '{}') || {};

  const index = (page - 1) * +pageSize; // default pageSize is 3

  // process filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      delete filters[key];
      return;
    }

    if (typeof value === 'string') {
      filters[key] = {
        contains: value,
      };
    }
  });
  return {
    page: page,
    pageSize: pageSize,
    filters: filters,
    index: index,
  };
}

export async function getItemsPagination<T>(
  query: QueryPaginationDto,
  modelAccessor: FindManyAndCountModel,
  specificFilters: Object,
): Promise<PaginationResult<T>> {
  let paginationParams = getPaginationParams(query);

  const completeFilters = {
    ...paginationParams.filters,
    ...specificFilters,
  };
  const viTriPromise = modelAccessor.findMany({
    skip: paginationParams.index,
    take: +paginationParams.pageSize,

    where: {
      ...completeFilters,
    },
  });

  // counts total rows in table
  const totalItemsPromise = modelAccessor.count();

  const [items, totalItems] = await Promise.all([
    viTriPromise,
    totalItemsPromise,
  ]);

  // calculate total pages

  const totalPages = Math.ceil(totalItems / +paginationParams.pageSize);

  const results = {
    page: paginationParams.page,
    pageSize: paginationParams.pageSize,
    totalItems: totalItems,
    totalPages: totalPages,
    items: items || [],
  };

  return results;
}
