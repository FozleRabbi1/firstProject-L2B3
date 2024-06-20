import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { AuthValidation } from './Auth.validation';
import { AuthController } from './Auth.controller';
import { Auth } from '../../middleware/auth';
import { User_Role } from '../user/user.constent';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

router.post(
  '/change-password',
  Auth(User_Role.student, User_Role.faculty, User_Role.admin),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.passwordChange,
);
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgatePasswordValidationSchema),
  AuthController.forgatePassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword,
);

export const AuthRoute = router;
