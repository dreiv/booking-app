import app from '@/app';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { prismaMock } from './setup';

describe('Booking API Endpoints', () => {
  const validBookingData = {
    stayId: '550e8400-e29b-41d4-a716-446655440000',
    guestName: 'John Doe',
    guestEmail: 'john@example.com',
    checkIn: '2026-05-01T14:00:00Z',
    checkOut: '2026-05-05T11:00:00Z',
    totalPrice: 450.5,
  };

  it('should return 400 if validation fails (e.g., invalid email)', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .send({ ...validBookingData, guestEmail: 'not-an-email' });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Validation failed');

    // Ensure DB was never touched
    expect(prismaMock.booking.create).not.toHaveBeenCalled();
  });

  it('should create a booking successfully with valid data', async () => {
    const mockDbResponse = {
      id: 'booking-123',
      ...validBookingData,
      checkIn: new Date(validBookingData.checkIn),
      checkOut: new Date(validBookingData.checkOut),
      status: 'CONFIRMED',
      createdAt: new Date(),
    };

    prismaMock.booking.create.mockResolvedValue(mockDbResponse);
    const response = await request(app).post('/api/bookings').send(validBookingData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Booking confirmed!');
    expect(response.body.booking.id).toBe('booking-123');

    expect(prismaMock.booking.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        guestEmail: 'john@example.com',
        stayId: validBookingData.stayId,
      }),
    });
  });

  it('should fetch all bookings', async () => {
    prismaMock.booking.findMany.mockResolvedValue([]);

    const response = await request(app).get('/api/bookings');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(prismaMock.booking.findMany).toHaveBeenCalled();
  });
});
