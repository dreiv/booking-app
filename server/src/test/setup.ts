import type { PrismaClient } from '@/_generated/client/client';
import { beforeEach, vi } from 'vitest';
import { mockDeep, mockReset, type DeepMockProxy } from 'vitest-mock-extended';

vi.mock('@/db', () => ({
  __esModule: true,
  prisma: mockDeep(),
  pool: {
    query: vi.fn(),
    end: vi.fn(),
  },
}));

import { prisma } from '@/db';

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
