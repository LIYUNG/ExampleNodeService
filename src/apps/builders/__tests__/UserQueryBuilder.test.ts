import { userQueryBuilder } from '../UserQueryBuilder';
import { Types } from 'mongoose';

describe('UserQueryBuilder', () => {
  beforeEach(() => {
    // Reset the query builder before each test
    userQueryBuilder.query = {};
    userQueryBuilder.options = {
      sort: { createdAt: -1 },
      limit: 10,
      skip: 0,
    };
  });

  describe('withId', () => {
    it('should add _id to query', () => {
      const id = new Types.ObjectId();
      const result = userQueryBuilder.withId(id).build();
      expect(result.filter._id).toBe(id);
    });
  });

  describe('withName', () => {
    it('should add exact name match to query', () => {
      const name = 'John Doe';
      const result = userQueryBuilder.withName(name).build();
      expect(result.filter.name).toBe(name);
    });
  });

  describe('withEmail', () => {
    it('should add exact email match to query', () => {
      const email = 'john@example.com';
      const result = userQueryBuilder.withEmail(email).build();
      expect(result.filter.email).toBe(email);
    });
  });

  describe('withDateRange', () => {
    it('should add date range to query', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const result = userQueryBuilder.withDateRange(startDate, endDate).build();
      expect(result.filter.createdAt).toEqual({
        $gte: startDate,
        $lte: endDate,
      });
    });

    it('should handle only start date', () => {
      const startDate = new Date('2024-01-01');
      const result = userQueryBuilder.withDateRange(startDate).build();
      expect(result.filter.createdAt).toEqual({
        $gte: startDate,
      });
    });

    it('should handle only end date', () => {
      const endDate = new Date('2024-12-31');
      const result = userQueryBuilder.withDateRange(undefined, endDate).build();
      expect(result.filter.createdAt).toEqual({
        $lte: endDate,
      });
    });

    it('should not add date range if no dates provided', () => {
      const result = userQueryBuilder.withDateRange().build();
      expect(result.filter.createdAt).toBeUndefined();
    });
  });

  describe('withNameSearch', () => {
    it('should add case-insensitive name search to query', () => {
      const searchTerm = 'john';
      const result = userQueryBuilder.withNameSearch(searchTerm).build();
      expect(result.filter.name).toEqual({
        $regex: searchTerm,
        $options: 'i',
      });
    });

    it('should not add name search if search term is empty', () => {
      const result = userQueryBuilder.withNameSearch('').build();
      expect(result.filter.name).toBeUndefined();
    });
  });

  describe('withEmailSearch', () => {
    it('should add case-insensitive email search to query', () => {
      const searchTerm = 'example.com';
      const result = userQueryBuilder.withEmailSearch(searchTerm).build();
      expect(result.filter.email).toEqual({
        $regex: searchTerm,
        $options: 'i',
      });
    });

    it('should not add email search if search term is empty', () => {
      const result = userQueryBuilder.withEmailSearch('').build();
      expect(result.filter.email).toBeUndefined();
    });
  });

  describe('withPagination', () => {
    it('should set pagination options', () => {
      const result = userQueryBuilder.withPagination(2, 20).build();
      expect(result.options.skip).toBe(20);
      expect(result.options.limit).toBe(20);
    });

    it('should handle string inputs', () => {
      const result = userQueryBuilder.withPagination('2', '20').build();
      expect(result.options.skip).toBe(20);
      expect(result.options.limit).toBe(20);
    });

    it('should use defaults for invalid inputs', () => {
      const result = userQueryBuilder.withPagination(-1, -20).build();
      expect(result.options.skip).toBe(0);
      expect(result.options.limit).toBe(10);
    });
  });

  describe('withSort', () => {
    it('should set sort options for ascending order', () => {
      const result = userQueryBuilder.withSort('name', 'asc').build();
      expect(result.options.sort).toEqual({ name: 1 });
    });

    it('should set sort options for descending order', () => {
      const result = userQueryBuilder.withSort('name', 'desc').build();
      expect(result.options.sort).toEqual({ name: -1 });
    });

    it('should use default field and order if not provided', () => {
      const result = userQueryBuilder.withSort().build();
      expect(result.options.sort).toEqual({ createdAt: 1 });
    });
  });

  describe('chaining', () => {
    it('should support method chaining', () => {
      const result = userQueryBuilder
        .withName('John')
        .withEmail('john@example.com')
        .withPagination(1, 10)
        .withSort('createdAt', 'desc')
        .build();

      expect(result.filter.name).toBe('John');
      expect(result.filter.email).toBe('john@example.com');
      expect(result.options.limit).toBe(10);
      expect(result.options.skip).toBe(0);
      expect(result.options.sort).toEqual({ createdAt: -1 });
    });
  });
});
