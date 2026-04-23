import filter from 'leo-profanity';
import { z } from 'zod';

export const GetStaysSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    location: z.string().optional(),
    ids: z.union([z.string(), z.array(z.string())]).optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'rating_desc', 'newest']).default('newest'),
    nwLat: z.coerce.number().optional(),
    nwLng: z.coerce.number().optional(),
    seLat: z.coerce.number().optional(),
    seLng: z.coerce.number().optional(),
  }),
});

export const StayIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Invalid Stay ID format' }),
  }),
});

const validateProfanity = (val: string) => !filter.check(val);
export const CreateReviewSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.coerce
      .string()
      .min(3)
      .refine(validateProfanity, { message: 'Comment contains inappropriate language' }),
    authorName: z.coerce
      .string()
      .min(2)
      .refine(validateProfanity, { message: 'Username contains inappropriate language' }),
  }),
});

export type GetStaysInput = z.infer<typeof GetStaysSchema>['query'];
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
