import { Review } from '@/_generated/client/client';
import app from '@/app';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { prismaMock } from './setup';

describe('Stay API Endpoints', () => {
  const mockStayId = '550e8400-e29b-41d4-a716-446655440000';

  it('GET /api/stays should return paginated data', async () => {
    prismaMock.stay.findMany.mockResolvedValue([]);
    prismaMock.stay.count.mockResolvedValue(0);

    const res = await request(app).get('/api/stays?page=2&limit=5');

    expect(res.status).toBe(200);
    expect(res.body.meta.page).toBe('2');

    expect(prismaMock.stay.findMany).toHaveBeenCalledWith({
      where: { location: undefined },
      skip: 5,
      take: '5',
      orderBy: { createdAt: 'desc' },
    });
  });

  it('GET /api/stays/:id should return 400 for invalid UUID', async () => {
    const res = await request(app).get('/api/stays/not-a-uuid');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('GET /api/stays/:id/reviews should return a list of reviews', async () => {
    const mockId = '550e8400-e29b-41d4-a716-446655440000';
    prismaMock.review.findMany.mockResolvedValue([
      {
        id: '1',
        rating: 5,
        comment: 'Great!',
        authorName: 'Drei',
        stayId: mockId,
        createdAt: new Date(),
      },
    ] as Review[]);

    const res = await request(app).get(`/api/stays/${mockId}/reviews`);

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
      comment: 'This place is shit',
      authorName: 'Drei',
    };

    const res = await request(app).post(`/api/stays/${mockStayId}/reviews`).send(badData);

    expect(res.status).toBe(400);
    expect(res.body.errors[0].message).toContain('inappropriate language');
  });
});
