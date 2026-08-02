import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.get(
  '/me',
  auth(UserRole.ADMIN, UserRole.USER),
  UserController.GetMe,
);
router.patch(
  '/me',
  auth(UserRole.ADMIN, UserRole.USER),
  UserController.UpdateMe,
);

router.get('/', auth(UserRole.ADMIN), UserController.GetAllUsers);
router
  .route('/:id')
  .get(auth(UserRole.ADMIN), UserController.GetSingleUser)
  .delete(auth(UserRole.ADMIN), UserController.DeleteUser);

export const userRouter = router;
