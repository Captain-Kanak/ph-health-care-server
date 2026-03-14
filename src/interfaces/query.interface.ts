export interface PrismaFindManyArgs {
  skip?: number;
  take?: number;
  where?: PrismaWhereConditions;
  orderBy?: Record<string, "asc" | "desc"> | Record<string, unknown>;
  include?: Record<string, boolean | unknown>;
  select?: Record<string, boolean | unknown>;
  cursor?: Record<string, unknown>;
  distinct?: string | string[];
  [key: string]: unknown;
}

export interface PrismaCountArgs {
  where?: PrismaWhereConditions;
  [key: string]: unknown;
}

export interface PrismaWhereConditions {
  OR?: Record<string, unknown>[];
  AND?: Record<string, unknown>[];
  NOT?: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface PrismaModelDelegate {
  findMany(args?: any): Promise<any[]>;
  count(args?: any): Promise<number>;
}

export interface IQueryParams {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  fields?: string;
  includes?: string | undefined;
  [key: string]: string | undefined;
}

export interface IQueryConfig {
  searchableFields?: string[];
  filterableFields?: string[];
}

export interface PrismaStringFilter {
  mode?: "insensitive" | "default";
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  not?: string | PrismaStringFilter;
  in?: string[];
  notIn?: string[];
}

export interface PrismaNumberFilter {
  equals?: number;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  not?: number | PrismaNumberFilter;
  in?: number[];
  notIn?: number[];
}

export interface IQueryResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
