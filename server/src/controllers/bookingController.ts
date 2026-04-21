import { Request, Response } from 'express';
import { prisma } from '../db';
import { CreateBookingInput } from '../schemas/bookingSchema';
import { asyncHandler } from '../utils/asyncHandler';

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateBookingInput;

  const booking = await prisma.booking.create({
    data: {
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      totalPrice: data.totalPrice,
      stayId: data.stayId,
      status: 'CONFIRMED',
    },
  });

  res.status(201).json({ message: 'Booking confirmed!', booking });
});

export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await prisma.booking.findMany({
    include: { stay: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(bookings);
});
