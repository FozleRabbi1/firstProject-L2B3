import express from 'express';
import { userController } from './user.controller';
import { studentValidatiSchema } from '../student/student.validation';
import { validateRequest } from '../../middleware/validateRequest';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidatiSchema.createStudentValidationSchema),
  userController.createStudent,
);

export const UserRouter = router;
