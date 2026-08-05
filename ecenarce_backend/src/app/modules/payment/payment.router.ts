import { Router } from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';
import { PaymentController } from './payment.controller';

const router = Router();

router.post(
  '/eps/init/:orderId',
  auth(UserRole.USER, UserRole.ADMIN),
  PaymentController.InitOrderPayment,
);

router.get(
  '/eps/verify/:orderId',
  auth(UserRole.USER, UserRole.ADMIN),
  PaymentController.verifyStatus,
);

// EPS gateway callbacks (public — verified server-side)
router.get('/eps/success', PaymentController.successCallback);
router.post('/eps/success', PaymentController.successCallback);
router.get('/eps/fail', PaymentController.failCallback);
router.post('/eps/fail', PaymentController.failCallback);
router.get('/eps/cancel', PaymentController.cancelCallback);
router.post('/eps/cancel', PaymentController.cancelCallback);

export const PaymentRouter = router;
