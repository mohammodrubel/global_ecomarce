import { Router } from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';
import { ReviewController } from './review.controller';

const router = Router();

// Public
router.get('/product/:productId', ReviewController.GetProductReviews);

// Authenticated
router.post('/', auth(UserRole.USER, UserRole.ADMIN), ReviewController.CreateReview);
router.get('/me', auth(UserRole.USER, UserRole.ADMIN), ReviewController.GetMyReviews);

export const ReviewRouter = router;
