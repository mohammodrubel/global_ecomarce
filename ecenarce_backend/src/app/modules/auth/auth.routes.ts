import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import AuthValidation from './auth.validation';
import AuthController from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.LoginSchema),
  AuthController.Login,
);

router.post(
  '/register',
  validateRequest(AuthValidation.RegisterSchema),
  AuthController.Register,
);

router.patch(
  '/change-password',
  auth(UserRole.ADMIN, UserRole.USER,),
  validateRequest(AuthValidation.ChangePasswordSchema),
  AuthController.ChangePassword,
);

export const AuthRoutes = router;
