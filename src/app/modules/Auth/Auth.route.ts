import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { AuthValidation } from './Auth.validation';
import { AuthController } from './Auth.controller';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

export const AuthRoute = router;
