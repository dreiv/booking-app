import { z } from 'zod';

export const CreateBookingSchema = z.object({
  body: z.object({
    stayId: z.string().uuid({ message: 'stayId must be a valid UUID' }),
    guestName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    guestEmail: z.string().email({ message: 'Invalid email address' }),
    checkIn: z.string().pipe(z.coerce.date()),
    checkOut: z.string().pipe(z.coerce.date()),
    totalPrice: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  }),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>['body'];
