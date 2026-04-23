/* eslint-disable @typescript-eslint/no-explicit-any */

import { Review, Stay } from '@/_generated/client/client';
import app from '@/app';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { prismaMock } from './setup';

import { Prisma } from '@/_generated/client/client';

describe('Stay API Endpoints', () => {
  const mockStayId = '550e8400-e29b-41d4-a716-446655440000';

  it('GET /api/stays should return paginated data and filter for availability', async () => {
    const totalCount = 20;
    const page = 2;
    const limit = 5;

    prismaMock.stay.findMany.mockResolvedValue(Array.from({ length: 5 }, () => ({})) as Stay[]);
    prismaMock.stay.count.mockResolvedValue(totalCount);

    const res = await request(app).get(`/api/stays?page=${page}&limit=${limit}`);

    expect(res.status).toBe(200);
    expect(res.body.meta).toEqual({
      totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: 4,
      hasNextPage: true,
      hasPrevPage: true,
    });

    expect(prismaMock.stay.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          bookings: { none: {} },
          location: undefined,
        },
        include: {
          _count: { select: { bookings: true } },
        },
      }),
    );
  });

  it('GET /api/stays/:id should return stay details including booking count', async () => {
    // Define the shape of what findUnique returns in this specific case
    type StayWithCount = Prisma.StayGetPayload<{
      include: {
        reviews: true;
        _count: { select: { bookings: true } };
      };
    }>;

    const mockStay: StayWithCount = {
      id: mockStayId,
      name: 'Test Stay',
      description: 'A test stay',
      location: 'Test Location',
      latitude: 0,
      longitude: 0,
      price: 100,
      rating: 5,
      images: [],
      createdAt: new Date(),
      reviews: [],
      _count: { bookings: 1 },
    };

    prismaMock.stay.findUnique.mockResolvedValue(mockStay);

    const res = await request(app).get(`/api/stays/${mockStayId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(mockStayId);
    expect(res.body._count.bookings).toBe(1);

    expect(prismaMock.stay.findUnique).toHaveBeenCalledWith({
      where: { id: mockStayId },
      include: {
        reviews: true,
        _count: { select: { bookings: true } },
      },
    });
  });

  it('GET /api/stays with IDs should ignore availability and location filters', async () => {
    const favIds = [mockStayId];
    prismaMock.stay.findMany.mockResolvedValue([{} as Stay]);
    prismaMock.stay.count.mockResolvedValue(1);

    const res = await request(app).get(`/api/stays?ids=${mockStayId}`);

    expect(res.status).toBe(200);
    expect(prismaMock.stay.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: { in: favIds } },
        include: {
          _count: { select: { bookings: true } },
        },
      }),
    );
  });

  it('GET /api/stays/:id should return 400 for invalid UUID', async () => {
    const res = await request(app).get('/api/stays/not-a-uuid');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('GET /api/stays/:id/reviews should return a list of reviews', async () => {
    prismaMock.review.findMany.mockResolvedValue([
      {
        id: '1',
        rating: 5,
        comment: 'Great!',
        authorName: 'Drei',
        stayId: mockStayId,
        createdAt: new Date(),
      },
    ] as Review[]);

    const res = await request(app).get(`/api/stays/${mockStayId}/reviews`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].comment).toBe('Great!');
  });

  it('POST /api/stays/:id/reviews should create a review', async () => {
    const reviewData = { rating: 5, comment: 'Amazing!', authorName: 'Drei' };
    const createdReview = {
      id: 'rev-1',
      stayId: mockStayId,
      ...reviewData,
      createdAt: new Date(),
    } as Review;

    prismaMock.$transaction.mockImplementation(async (callback) => callback(prismaMock));

    prismaMock.review.create.mockResolvedValue(createdReview);

    prismaMock.review.aggregate.mockResolvedValue({ _avg: { rating: 5 } } as any);
    prismaMock.stay.update.mockResolvedValue({} as any);

    const res = await request(app).post(`/api/stays/${mockStayId}/reviews`).send(reviewData);

    expect(res.status).toBe(201);
    expect(res.body.comment).toBe('Amazing!'); // This should now pass
    expect(prismaMock.review.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ stayId: mockStayId, rating: 5 }),
    });
  });

  it('POST /api/stays/:id/reviews should return 400 if comment has profanity', async () => {
    const badData = {
      rating: 5,
      comment: 'This place is shit',
      authorName: 'Drei',
    };

    const res = await request(app).post(`/api/stays/${mockStayId}/reviews`).send(badData);

    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).toContain('inappropriate language');
  });
});
