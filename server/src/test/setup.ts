import { PrismaClient } from '@/_generated/client/client';
import { Pool } from 'pg';
import { beforeEach, vi } from 'vitest';
import { DeepMockProxy, mockDeep, mockReset } from 'vitest-mock-extended';

vi.mock('../db', () => ({
  prisma: mockDeep<PrismaClient>(),
  pool: mockDeep<Pool>(),
}));

import { prisma } from '../db';

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
