import { prismaMock } from '@/test/setup';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from './app';

describe('Global App Configuration', () => {
  it('should have CORS enabled', async () => {
    const res = await request(app).get('/');
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/not-a-real-route');
    expect(res.status).toBe(404);
  });

  it('should return 400 for Zod validation errors', async () => {
    const res = await request(app).post('/api/bookings').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('errors');
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('should handle internal 500 errors through centralized handler', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    prismaMock.stay.findMany.mockRejectedValue(new Error('Database explosion! 💥'));

    const res = await request(app).get('/api/stays');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Database explosion! 💥' });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
