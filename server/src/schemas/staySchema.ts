import { z } from 'zod';

export const GetStaysSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    location: z.string().optional(),
  }),
});

export const StayIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Invalid Stay ID format' }),
  }),
});

export const CreateReviewSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.coerce.string().min(3),
    authorName: z.coerce.string().min(2),
  }),
});

export type GetStaysInput = z.infer<typeof GetStaysSchema>['query'];
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
