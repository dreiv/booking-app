import {
  createReview,
  getAllStays,
  getStayById,
  getStayReviews,
} from '@/controllers/stayController';
import { CreateReviewSchema, GetStaysSchema, StayIdParamSchema } from '@/schemas/staySchema';
import { validate } from '@/utils/validate';
import { Router } from 'express';

const router = Router();

router.get('/', validate(GetStaysSchema), getAllStays);
router.get('/:id', validate(StayIdParamSchema), getStayById);
router.get('/:id/reviews', validate(StayIdParamSchema), getStayReviews);
router.post('/:id/reviews', validate(CreateReviewSchema), createReview);

export default router;
