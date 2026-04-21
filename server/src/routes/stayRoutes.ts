import { Router } from 'express';
import {
  createReview,
  getAllStays,
  getStayById,
  getStayReviews,
} from '../controllers/stayController';

const router = Router();

// /api/stays
router.get('/', getAllStays);
router.get('/:id', getStayById);
router.get('/:id/reviews', getStayReviews);
router.post('/:id/reviews', createReview);

export default router;
