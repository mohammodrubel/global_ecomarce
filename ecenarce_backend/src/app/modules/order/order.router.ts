import { Router } from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';
import { OrderController } from './order.controller';

const router = Router();

// Authenticated user
router.post('/', auth(UserRole.USER, UserRole.ADMIN), OrderController.CreateOrder);
router.get('/me', auth(UserRole.USER, UserRole.ADMIN), OrderController.GetMyOrders);
router.patch(
  '/:id/cancel',
  auth(UserRole.USER, UserRole.ADMIN),
  OrderController.CancelOrder,
);

// Admin
router.get('/', auth(UserRole.ADMIN), OrderController.GetAllOrders);
router.patch(
  '/:id/status',
  auth(UserRole.ADMIN),
  OrderController.UpdateOrderStatus,
);

// Both — placed after specific /me and /:id/cancel routes
router.get('/:id', auth(UserRole.USER, UserRole.ADMIN), OrderController.GetOrderById);

export const OrderRouter = router;
