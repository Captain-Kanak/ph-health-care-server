// ! case-studies link => https://www.portfolio.com/case-studies/ph-healthcare/server/query-builder

import {
  PrismaCountArgs,
  PrismaFindManyArgs,
  PrismaModelDelegate,
  IQueryConfig,
  IQueryParams,
  PrismaSearchString,
  PrismaWhereConditions,
  PrismaNumberFilter,
  QueryResult,
} from "../../interfaces/query-builder.interface";

class QueryBuilder<
  T,
  TWhere = Record<string, unknown>,
  TInclude = Record<string, unknown>,
> {
  private query: PrismaFindManyArgs;
  private countQuery: PrismaCountArgs;
  private page: number = 1;
  private limit: number = 10;
  private skip: number = 0;
  private sortBy: string = "createdAt";
  private sortOrder: "asc" | "desc" = "desc";
  private selectFields: Record<string, boolean | Record<string, unknown>>;

  constructor(
    private model: PrismaModelDelegate,
    private queryParams: IQueryParams,
    private config: IQueryConfig,
  ) {
    // this.page = Number(this.queryParams.page) || 1;
    // this.limit = Number(this.queryParams.limit) || 10;
    // this.skip = (this.page - 1) * this.limit;
    this.sortBy = this.queryParams.sortBy || "createdAt";
    this.sortOrder = this.queryParams.sortOrder || "desc";
    this.query = {
      skip: 0,
      take: 10,
      where: {},
      include: {},
      orderBy: {},
    };
    this.countQuery = {
      where: {},
    };
    this.selectFields = {};
  }

  search(): this {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;

    //! /doctor?searchTerm=d
    // ["name", "address", "specialities.speciality.title"]

    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions: Record<string, unknown>[] = searchableFields.map(
        (fields) => {
          const stringFilter: PrismaSearchString = {
            contains: searchTerm,
            mode: "insensitive",
          };

          if (fields.includes(".")) {
            const fieldParts = fields.split(".");

            if (fieldParts.length === 2) {
              const [field, nestedField] = fieldParts;

              return {
                [field]: {
                  [nestedField]: stringFilter,
                },
              };
            } else if (fieldParts.length === 3) {
              const [field, nestedField1, nestedField2] = fieldParts;

              if (Array.isArray(field)) {
                return {
                  [field]: {
                    some: {
                      [nestedField1]: {
                        [nestedField2]: stringFilter,
                      },
                    },
                  },
                };
              }

              return {
                [field]: {
                  [nestedField1]: {
                    [nestedField2]: stringFilter,
                  },
                },
              };
            }
          }

          return {
            [fields]: stringFilter,
          };
        },
      );

      const whereConditions = this.query.where as PrismaWhereConditions;
      const countWhereConditions = this.countQuery
        .where as PrismaWhereConditions;

      whereConditions.OR = searchConditions;
      countWhereConditions.OR = searchConditions;
    }

    return this;
  }

  filter(): this {
    const { filterableFields } = this.config;
    const excludedFields = [
      "searchTerm",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "includes",
    ];

    //! /doctors?appointmentFee[gt]=100&appointmentFee[lt]=500&experience[gt]=5&experience[lt]=10&gender[male]
    const filterParams: Record<string, unknown> = {};

    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedFields.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });

    const queryWhere = this.query.where as PrismaWhereConditions;
    const countQueryWhere = this.countQuery.where as PrismaWhereConditions;

    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];

      if (value === undefined || value === null || value === "") {
        return;
      }

      const isAllowedField =
        !filterableFields ||
        filterableFields.length === 0 ||
        filterableFields.includes(key);

      if (!isAllowedField) {
        return;
      }

      if (key.includes(".")) {
        const fieldParts = key.split(".");

        if (filterableFields && !filterableFields.includes(key)) {
          return;
        }

        if (fieldParts.length === 2) {
          const [field, nestedField] = fieldParts;

          if (!queryWhere[field]) {
            queryWhere[field] = {};
            countQueryWhere[field] = {};
          }

          queryWhere[field] = {
            [nestedField]: this._parseFilterValue(
              value as Record<string, string | number>,
            ),
          };

          countQueryWhere[field] = {
            [nestedField]: this._parseFilterValue(
              value as Record<string, string | number>,
            ),
          };

          return;
        } else if (fieldParts.length === 3) {
          const [field, nestedField1, nestedField2] = fieldParts;

          if (!queryWhere[field]) {
            queryWhere[field] = {};
            countQueryWhere[field] = {};
          }

          queryWhere[field] = {
            [nestedField1]: {
              [nestedField2]: this._parseFilterValue(
                value as Record<string, string | number>,
              ),
            },
          };

          countQueryWhere[field] = {
            [nestedField1]: {
              [nestedField2]: this._parseFilterValue(
                value as Record<string, string | number>,
              ),
            },
          };

          return;
        }
      } else {
        queryWhere[key] = this._parseFilterValue(value);
        countQueryWhere[key] = this._parseFilterValue(value);

        return;
      }

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        queryWhere[key] = this._parseRangeFilterValue(
          value as Record<string, string | number>,
        );
        countQueryWhere[key] = this._parseRangeFilterValue(
          value as Record<string, string | number>,
        );

        return;
      }

      queryWhere[key] = this._parseFilterValue(value);
      countQueryWhere[key] = this._parseFilterValue(value);
    });

    return this;
  }

  paginate(): this {
    const page = Number(this.queryParams.page) | 1;
    const limit = Number(this.queryParams.limit) | 10;
    const skip = (page - 1) * limit;

    /**
    // ! GET/doctors?page=1&limit=10
    // this.queryParams = {
    //   page: "1",
    //   limit: "10",
    // };
    // Number() => javascript built-in method convert string to a number
    */

    /**
     * ! calculate skip value
     * page = 1
     * limit = 10
     * skip = ((1 - 1) * 10)) => 0
     *
     * page = 2
     * limit = 10
     * skip = ((2 - 1) * 10) => 10
     *
     * page = 3
     * limit = 10
     * skip = ((3 - 1) * 10) => 20
     */

    this.page = page;
    this.limit = limit;
    this.skip = skip;

    this.query.skip = this.skip;
    this.query.take = this.limit;

    return this;
  }

  sort(): this {
    const sortBy = this.sortBy || "createdAt";
    const sortOrder = this.sortOrder || "desc";

    if (sortBy.includes(".")) {
      const fieldParts = sortBy.split(".");

      if (fieldParts.length === 2) {
        const [field, nestedField] = fieldParts;

        this.query.orderBy = {
          [field]: {
            [nestedField]: sortOrder,
          },
        };

        return this;
      } else if (fieldParts.length === 3) {
        const [field, nestedField1, nestedField2] = fieldParts;

        this.query.orderBy = {
          [field]: {
            [nestedField1]: {
              [nestedField2]: sortOrder,
            },
          },
        };

        return this;
      }
    }

    this.query.orderBy = {
      [sortBy]: sortOrder,
    };

    return this;
  }

  fields(): this {
    const fieldesParams = this.queryParams.fields;
    const fieldsArray =
      fieldesParams?.split(",").map((field) => field.trim()) || [];

    this.selectFields = {};

    fieldsArray.forEach((field) => {
      if (this.selectFields) {
        this.selectFields[field] = true;
      }

      this.query.select = this.selectFields;

      delete this.queryParams.includes;

      if (field.includes(".")) {
        const fieldParts = field.split(".");

        if (fieldParts.length === 2) {
          const [field, nestedField] = fieldParts;

          if (this.selectFields) {
            this.selectFields[field] = {
              [nestedField]: true,
            };
          }

          return;
        } else if (fieldParts.length === 3) {
          const [field, nestedField1, nestedField2] = fieldParts;

          if (this.selectFields) {
            this.selectFields[field] = {
              [nestedField1]: {
                [nestedField2]: true,
              },
            };
          }

          return;
        }
      }
    });

    return this;
  }

  includes(relation: TInclude): this {
    if (this.selectFields) {
      return this;
    }

    this.query.include = {
      ...(this.query.include || {}),
      ...relation,
    };

    return this;
  }

  dynamicIncludes(
    includeConfig: Record<string, unknown>,
    defaultInclude?: string[],
  ): this {
    if (this.selectFields) {
      return this;
    }

    const result: Record<string, unknown> = {};

    defaultInclude?.forEach((field) => {
      if (includeConfig[field]) {
        result[field] = includeConfig[field];
      }
    });

    const includeParams = this.queryParams.includes;

    if (includeParams && typeof includeParams === "string") {
      const requestedRelations = includeParams.split(",").map((r) => r.trim());

      requestedRelations.forEach((relation) => {
        if (includeConfig[relation]) {
          result[relation] = includeConfig[relation];
        }
      });
    }

    this.query.include = {
      ...(this.query.include || {}),
      ...result,
    };

    return this;
  }

  where(conditions: TWhere): this {
    this.query.where = this._deepMerge(
      this.query.where as Record<string, unknown>,
      conditions as Record<string, unknown>,
    );

    return this;
  }

  async execute(): Promise<QueryResult<T>> {
    const [total, data] = await Promise.all([
      this.model.count(
        this.countQuery as Parameters<typeof this.model.count>[0],
      ),
      this.model.findMany(
        this.query as Parameters<typeof this.model.findMany>[0],
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

  async count(): Promise<number> {
    return await this.model.count(
      this.countQuery as Parameters<typeof this.model.count>[0],
    );
  }

  getQuery(): PrismaFindManyArgs {
    return this.query as PrismaFindManyArgs;
  }

  private _deepMerge(
    target: Record<string, unknown>,
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
        } else {
          result[key] = source[key];
        }
      }
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

  private _parseRangeFilterValue(
    value: Record<string, number | string>,
  ): PrismaNumberFilter | PrismaSearchString | Record<string, unknown> {
    const rangeQuery: Record<string, string | number | (string | number)[]> =
      {};

    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];

      const parsedValue: number | string =
        typeof operatorValue === "string" && !isNaN(Number(operatorValue))
          ? Number(operatorValue)
          : operatorValue;

      switch (operator) {
        case "contains":
        case "startsWith":
        case "endsWith":
        case "equals":
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "not":
          rangeQuery[operator] = parsedValue;
          break;

        case "in":
        case "notIn":
          if (Array.isArray(operatorValue)) {
            rangeQuery[operator] = operatorValue;
          } else {
            rangeQuery[operator] = [parsedValue];
          }
          break;

        default:
          break;
      }
    });

    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
}
