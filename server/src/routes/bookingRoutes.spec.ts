import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../app';

// Mock the controllers to isolate the route logic
vi.mock('../controllers/bookingController', () => ({
  getBookings: vi.fn((req, res) => res.status(200).json([{ id: '1', guest: 'Drei' }])),
  createBooking: vi.fn((req, res) => res.status(201).json({ success: true })),
}));

describe('Booking API Endpoints', () => {
  it('GET / should return the welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('live');
  });

  it('GET /api/bookings should call the controller and return data', async () => {
    const res = await request(app).get('/api/bookings');
    expect(res.status).toBe(200);
    expect(res.body[0].guest).toBe('Drei');
  });
});
