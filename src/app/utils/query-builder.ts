import {
  IQueryConfig,
  IQueryParams,
  PrismaCountArgs,
  PrismaFindManyArgs,
  PrismaModelDelegate,
  PrismaNumberFilter,
  PrismaSearchString,
  PrismaWhereConditions,
  QueryResult,
} from "../../interfaces/query-builder.interface";

export class QueryBuilder<T, TWhereInput, TInclude> {
  private query: PrismaFindManyArgs;
  private countQuery: PrismaCountArgs;
  private page: number;
  private limit: number;
  private skip: number;
  private searchTerm: string;
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
    this.searchTerm = this.queryParams.searchTerm || "";
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

  search(): this {
    const { searchableFields } = this.config;

    if (this.searchTerm && searchableFields && searchableFields.length > 0) {
      const searchString: PrismaSearchString = {
        contains: this.searchTerm,
        mode: "insensitive",
      };

      const searchConditions: Record<string, unknown>[] = searchableFields.map(
        (fields) => {
          if (fields.includes(".")) {
            const fieldParts = fields.split(".").map((field) => field.trim());

            if (fieldParts.length === 2) {
              const [field, nestedField] = fieldParts;

              return {
                [field]: {
                  [nestedField]: searchString,
                },
              };
            } else if (fieldParts.length === 3) {
              const [field, nestedField1, nestedField2] = fieldParts;

              return {
                [field]: {
                  some: {
                    [nestedField1]: {
                      [nestedField2]: searchString,
                    },
                  },
                },
              };
            }
          }

          return {
            [fields]: searchString,
          };
        },
      );

      this.query.where = {
        ...this.query.where,
        OR: searchConditions,
      };
      this.countQuery.where = {
        ...this.countQuery.where,
        OR: searchConditions,
      };
    }

    return this;
  }

  filter(): this {
    const { filterableFields } = this.config;
    const excludedFields = [
      "page",
      "limit",
      "searchTerm",
      "sortBy",
      "sortOrder",
    ];

    const filterParams: Record<string, unknown> = {};

    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedFields.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });

    Object.keys(filterParams).forEach((field) => {
      const value = filterParams[field];

      if (value === "" || value === undefined || value === null) {
        return;
      }

      const isAllowedField =
        !filterableFields ||
        filterableFields.length === 0 ||
        filterableFields.includes(field);

      if (!isAllowedField) {
        return;
      }

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        this.query.where = {
          ...this.query.where,
          [field]: this._parseFilterValueRange(
            value as Record<string, string | number>,
          ),
        };

        this.countQuery.where = {
          ...this.countQuery.where,
          [field]: this._parseFilterValueRange(
            value as Record<string, string | number>,
          ),
        };

        return;
      }

      if (filterableFields && !filterableFields.includes(field)) {
        return;
      }

      if (field.includes(".")) {
        const fieldParts = field.split(".").map((field) => field.trim());

        if (fieldParts.length === 2) {
          const [field, nestedField] = fieldParts;

          this.query.where = {
            ...this.query.where,
            [field]: {
              some: {
                [nestedField]: this._parseFilterValue(value),
              },
            },
          };

          this.countQuery.where = {
            ...this.countQuery.where,
            [field]: {
              some: {
                [nestedField]: this._parseFilterValue(value),
              },
            },
          };

          return;
        } else if (fieldParts.length === 3) {
          const [field, nestedField1, nestedField2] = fieldParts;

          this.query.where = {
            ...this.query.where,
            [field]: {
              some: {
                [nestedField1]: {
                  [nestedField2]: this._parseFilterValue(value),
                },
              },
            },
          };

          this.countQuery.where = {
            ...this.countQuery.where,
            [field]: {
              some: {
                [nestedField1]: {
                  [nestedField2]: this._parseFilterValue(value),
                },
              },
            },
          };

          return;
        }
      }

      this.query.where = {
        ...this.query.where,
        [field]: this._parseFilterValue(value),
      };

      this.countQuery.where = {
        ...this.countQuery.where,
        [field]: this._parseFilterValue(value),
      };
    });

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

  select(): this {
    const { fields } = this.queryParams;
    const fieldsArray = fields?.split(",").map((field) => field.trim());

    if (fieldsArray?.length) {
      delete this.queryParams.includes;
    }

    fieldsArray?.forEach((field) => {
      if (field.includes(".")) {
        const fieldParts = field.split(".").map((field) => field.trim());

        if (fieldParts.length === 2) {
          const [field, nestedField] = fieldParts;

          this.query.select = {
            ...this.query.select,
            [field]: {
              select: {
                [nestedField]: true,
              },
            },
          };

          return;
        } else if (fieldParts.length === 3) {
          const [field, nestedField1, nestedField2] = fieldParts;

          this.query.select = {
            ...this.query.select,
            [field]: {
              select: {
                [nestedField1]: {
                  select: {
                    [nestedField2]: true,
                  },
                },
              },
            },
          };

          return;
        }
      }

      this.query.select = {
        ...this.query.select,
        [field]: true,
      };
    });

    return this;
  }

  includes(relations: TInclude): this {
    if (this.queryParams.fields) {
      return this;
    }

    this.query.include = {
      ...this.query.include,
      ...relations,
    };

    return this;
  }

  async execute(): Promise<QueryResult<T>> {
    const [data, total] = await Promise.all([
      this.model.findMany(
        this.query as Parameters<typeof this.model.findMany>[0],
      ),
      this.model.count(
        this.countQuery as Parameters<typeof this.model.count>[0],
      ),
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

  private _parseFilterValue(value: unknown): unknown {
    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }

    if (typeof value === "string" && !isNaN(Number(value)) && value !== "") {
      return Number(value);
    }

    if (Array.isArray(value)) {
      return {
        in: value.map((item) => this._parseFilterValue(item)),
      };
    }

    return value;
  }

  private _parseFilterValueRange(
    value: Record<string, string | number>,
  ): PrismaNumberFilter | PrismaSearchString {
    const rangeQuery: Record<string, unknown> = {};

    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];

      const parsedValue: number | string =
        typeof operatorValue === "string" && !isNaN(Number(operatorValue))
          ? Number(operatorValue)
          : operatorValue;

      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
          rangeQuery[operator] = parsedValue;
          break;

        default:
          break;
      }
    });

    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
}
