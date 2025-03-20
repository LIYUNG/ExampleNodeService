import { BaseQueryBuilder } from './BaseQueryBuilder';
import { Types } from 'mongoose';

interface UserFilter extends Record<string, unknown> {
  _id?: string | Types.ObjectId;
  name?: string | { $regex: string; $options: string };
  email?: string | { $regex: string; $options: string };
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
}

interface QueryOptions {
  sort: { [key: string]: 1 | -1 };
  limit: number;
  skip: number;
}

export class UserQueryBuilder extends BaseQueryBuilder {
  declare query: UserFilter;

  constructor() {
    super();
    this.query = {};
  }

  withId(id: string | Types.ObjectId) {
    this.query = {
      ...this.query,
      _id: id,
    };
    return this;
  }

  withName(name: string) {
    this.query = {
      ...this.query,
      name: name,
    };
    return this;
  }

  withEmail(email: string) {
    this.query = {
      ...this.query,
      email: email,
    };
    return this;
  }

  withDateRange(startDate?: Date, endDate?: Date) {
    if (!startDate && !endDate) return this;

    this.query = {
      ...this.query,
      createdAt: {
        ...(startDate && { $gte: startDate }),
        ...(endDate && { $lte: endDate }),
      },
    };
    return this;
  }

  withNameSearch(searchTerm: string) {
    if (!searchTerm) return this;

    this.query = {
      ...this.query,
      name: { $regex: searchTerm, $options: 'i' },
    };
    return this;
  }

  withEmailSearch(searchTerm: string) {
    if (!searchTerm) return this;

    this.query = {
      ...this.query,
      email: { $regex: searchTerm, $options: 'i' },
    };
    return this;
  }

  override build(): { filter: UserFilter; options: QueryOptions } {
    return {
      filter: this.query,
      options: this.options,
    };
  }
}

// Export a singleton instance
export const userQueryBuilder = new UserQueryBuilder();
