import { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { asyncHandler } from '@/utils/asyncHandler';
import { validate } from '@/utils/validate';

describe('Utility Functions', () => {
  const createMocks = () => {
    const req = { body: {}, query: {}, params: {} } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn();
    return { req, res, next };
  };

  describe('asyncHandler', () => {
    it('should call next with an error if the promise rejects', async () => {
      const { req, res, next } = createMocks();
      const error = new Error('Async Failure');

      const fn = async () => {
        throw error;
      };
      const handler = asyncHandler(fn);

      handler(req, res, next);

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(next).toHaveBeenCalledWith(error);
    });

    it('should execute the function successfully', async () => {
      const { req, res, next } = createMocks();
      const fn = vi.fn().mockResolvedValue('success');

      const handler = asyncHandler(fn);
      handler(req, res, next);

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(fn).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('validate middleware', () => {
    const testSchema = z.object({
      body: z.object({
        name: z.string().min(3),
      }),
    });

    it('should call next() if validation passes', async () => {
      const { req, res, next } = createMocks();
      req.body = { name: 'Drei' };

      const middleware = validate(testSchema);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 if validation fails', async () => {
      const { req, res, next } = createMocks();
      req.body = { name: 'hi' }; // Too short (min 3)

      const middleware = validate(testSchema);
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Validation failed',
        }),
      );
      expect(next).not.toHaveBeenCalled();
    });
  });
});
