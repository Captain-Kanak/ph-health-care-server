interface PrismaFindManyArgs {
  skip?: number;
  take?: number;
  where?: PrismaWhereConditions;
  orderBy?: Record<string, "asc" | "desc" | unknown>;
  include?: Record<string, boolean | unknown>;
  select?: Record<string, boolean | unknown>;
  cursor?: Record<string, unknown>;
  distinct?: string | string[];
  [key: string]: unknown;
}

interface PrismaCountArgs {
  where?: PrismaWhereConditions;
  [key: string]: unknown;
}

interface PrismaWhereConditions {
  OR?: Record<string, unknown>[];
  AND?: Record<string, unknown>[];
  NOT?: Record<string, unknown>[];
  [key: string]: unknown;
}

interface PrismaModelDelegate {
  findMany(args?: any): Promise<any[]>;
  count(args?: any): Promise<number>;
}

interface IQueryParams {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  [key: string]: string | undefined;
}

interface IQueryConfig {}

interface IQueryResult<T> {
  data: T[];
  meta: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class QueryBuilder<T, TWhereInput, TInclude> {
  private query: PrismaFindManyArgs;
  private countQuery: PrismaCountArgs;
  private page: number;
  private limit: number;
  private skip: number;
  private sortBy: string;
  private sortOrder: "asc" | "desc";

  constructor(
    private model: PrismaModelDelegate,
    private queryParams: IQueryParams,
    private config: IQueryConfig,
  ) {
    this.page = Number(this.queryParams.page) || 1;
    this.limit = Number(this.queryParams.limit) || 10;
    this.skip = (this.page - 1) * this.limit;
    this.sortBy = this.queryParams.sortBy || "createdAt";
    this.sortOrder = this.queryParams.sortOrder || "desc";
    this.query = {};
    this.countQuery = {};
  }

  paginate(): this {
    this.query = {
      ...this.query,
      skip: this.skip,
      take: this.limit,
    };

    return this;
  }

  where(conditions: TWhereInput): this {
    this.query.where = this._deepMerge(
      this.query.where as PrismaWhereConditions,
      conditions as Record<string, unknown>,
    );

    this.countQuery.where = this._deepMerge(
      this.countQuery.where as PrismaWhereConditions,
      conditions as Record<string, unknown>,
    );

    return this;
  }

  sort(): this {
    if (this.sortBy.includes(".")) {
      const fieldParts = this.sortBy.split(".").map((field) => field.trim());

      console.log(fieldParts);

      if (fieldParts.length === 2) {
        const [field, nestedField] = fieldParts;

        this.query.orderBy = {
          [field]: {
            [nestedField]: this.sortOrder,
          },
        };

        return this;
      } else if (fieldParts.length === 3) {
        const [field, nestedField1, nestedField2] = fieldParts;

        this.query.orderBy = {
          [field]: {
            [nestedField1]: {
              [nestedField2]: this.sortOrder,
            },
          },
        };

        return this;
      }
    }

    this.query.orderBy = {
      [this.sortBy]: this.sortOrder,
    };

    return this;
  }

  async execute(): Promise<IQueryResult<T>> {
    const [data, total] = await Promise.all([
      this.model.findMany(this.query),
      this.model.count(this.countQuery),
    ]);

    const totalPages = Math.ceil(total / this.limit);

    return {
      data,
      meta: {
        currentPage: this.page,
        limit: this.limit,
        total: total,
        totalPages,
      },
    };
  }

  private _deepMerge(
    target: PrismaWhereConditions,
    source: Record<string, unknown>,
  ): Record<string, unknown> {
    const result = { ...target };

    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        if (
          result[key] &&
          typeof result[key] === "object" &&
          !Array.isArray(result[key])
        ) {
          result[key] = this._deepMerge(
            result[key] as Record<string, unknown>,
            source[key] as Record<string, unknown>,
          );
        }
      }

      result[key] = source[key];
    }

    return result;
  }
}
