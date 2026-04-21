import { Router } from 'express';

import { createBooking, getBookings } from '@/controllers/bookingController';
import { CreateBookingSchema } from '@/schemas/bookingSchema';
import { validate } from '@/utils/validate';

const router = Router();

// /api/bookings
router.get('/', getBookings);
router.post('/', validate(CreateBookingSchema), createBooking);

export default router;
