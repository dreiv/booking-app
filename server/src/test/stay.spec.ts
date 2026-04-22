import { Review, Stay } from '@/_generated/client/client';
import app from '@/app';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { prismaMock } from './setup';

describe('Stay API Endpoints', () => {
  const mockStayId = '550e8400-e29b-41d4-a716-446655440000';

  it('GET /api/stays should return paginated data with next/prev flags', async () => {
    const totalCount = 20;
    const page = 2;
    const limit = 5;

    prismaMock.stay.findMany.mockResolvedValue(Array.from({ length: 5 }, () => ({})) as Stay[]);
    prismaMock.stay.count.mockResolvedValue(totalCount);

    const res = await request(app).get(`/api/stays?page=${page}&limit=${limit}`);

    expect(res.status).toBe(200);

    expect(res.body.meta).toEqual({
      totalCount,
      page,
      limit,
      totalPages: 4,
      hasNextPage: true, // 2 < 4
      hasPrevPage: true, // 2 > 1
    });

    expect(prismaMock.stay.findMany).toHaveBeenCalledWith({
      where: { location: undefined },
      skip: (page - 1) * limit, // should be 5
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  });

  it('GET /api/stays should handle the first page correctly', async () => {
    prismaMock.stay.findMany.mockResolvedValue([]);
    prismaMock.stay.count.mockResolvedValue(10);

    const res = await request(app).get('/api/stays?page=1&limit=10');

    expect(res.body.meta.hasNextPage).toBe(false); // Only 1 page total
    expect(res.body.meta.hasPrevPage).toBe(false);
  });

  it('GET /api/stays/:id should return 400 for invalid UUID', async () => {
    const res = await request(app).get('/api/stays/not-a-uuid');
    expect(res.status).toBe(400);

    // Note: ensure your global error handler or validate middleware returns this specific string
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

    prismaMock.review.create.mockResolvedValue({
      id: 'rev-1',
      stayId: mockStayId,
      ...reviewData,
      createdAt: new Date(),
    } as Review);

    const res = await request(app).post(`/api/stays/${mockStayId}/reviews`).send(reviewData);

    expect(res.status).toBe(201);
    expect(res.body.comment).toBe('Amazing!');
    expect(prismaMock.review.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ stayId: mockStayId, rating: 5 }),
    });
  });

  it('POST /api/stays/:id/reviews should return 400 if comment has profanity', async () => {
    const badData = {
      rating: 5,
      comment: 'This place is shit', // Assuming 'shit' is in the profanity filter
      authorName: 'Drei',
    };

    const res = await request(app).post(`/api/stays/${mockStayId}/reviews`).send(badData);

    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).toContain('inappropriate language');
  });
});
