import { Router } from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';
import { CouponController } from './coupon.controller';

const router = Router();

// Public
router.get('/latest', CouponController.GetLatestCoupon);
router.post('/apply', CouponController.ApplyCoupon);

// Admin
router.post('/', auth(UserRole.ADMIN), CouponController.CreateCoupon);
router.get('/', auth(UserRole.ADMIN), CouponController.GetAllCoupons);
router.patch(
  '/:id/toggle',
  auth(UserRole.ADMIN),
  CouponController.ToggleCoupon,
);
router.delete('/:id', auth(UserRole.ADMIN), CouponController.DeleteCoupon);

export const CouponRouter = router;
