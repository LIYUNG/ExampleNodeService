interface QueryOptions {
  sort: { [key: string]: 1 | -1 };
  limit: number;
  skip: number;
}

export class BaseQueryBuilder {
  query: Record<string, unknown>;
  options: QueryOptions;

  constructor() {
    this.query = {};
    this.options = {
      sort: { createdAt: -1 },
      limit: 10,
      skip: 0,
    };
  }

  withPagination(page: number | string = 1, limit: number | string = 10) {
    const parsedPage = typeof page === 'string' ? parseInt(page) : page;
    const parsedLimit = typeof limit === 'string' ? parseInt(limit) : limit;
    // Use defaults if values are invalid (negative or NaN)
    this.options = {
      ...this.options,
      limit: parsedLimit > 0 ? parsedLimit : 10,
      skip:
        parsedPage > 0
          ? (parsedPage - 1) * (parsedLimit > 0 ? parsedLimit : 10)
          : 0,
    };
    return this;
  }

  withSort(field = 'createdAt', order: 'asc' | 'desc' = 'asc') {
    // Ensure field has a default value
    const sortField = field || 'createdAt';
    // Convert order to lowercase and validate
    const sortOrder = order === 'desc' ? -1 : 1;

    this.options = {
      ...this.options,
      sort: { [sortField]: sortOrder },
    };
    return this;
  }

  build() {
    return {
      filter: this.query,
      options: this.options,
    };
  }
}

// Export a singleton instance for backward compatibility
export const baseQueryBuilder = new BaseQueryBuilder();
