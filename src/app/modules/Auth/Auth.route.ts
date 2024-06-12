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

export const AuthRoute = router;
