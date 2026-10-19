import type { Prisma, PrismaClient } from '../generated/prisma/client';

const MAX_PAGE_SIZE = 100;

export abstract class BaseRepository {
  protected constructor(protected readonly prisma: PrismaClient) {}

  protected withTransaction<T>(
    operation: (transaction: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(operation);
  }

  protected pagination(page = 1, pageSize = 25): { skip: number; take: number } {
    if (!Number.isSafeInteger(page) || page < 1) {
      throw new RangeError('page must be a positive safe integer.');
    }

    if (!Number.isSafeInteger(pageSize) || pageSize < 1) {
      throw new RangeError('pageSize must be a positive safe integer.');
    }

    const take = Math.min(pageSize, MAX_PAGE_SIZE);
    const skip = (page - 1) * take;

    if (!Number.isSafeInteger(skip)) {
      throw new RangeError('page and pageSize exceed the supported range.');
    }

    return { skip, take };
  }
}
