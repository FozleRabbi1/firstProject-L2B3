import express from 'express';
import { Auth } from '../../middleware/auth';
import { User_Role } from '../user/user.constent';
import { validateRequest } from '../../middleware/validateRequest';
import { EnrolledCourseValidations } from './EnrolledCourse.validation';
import { EnrolledCourseControllers } from './EnrolledCourse.controller';

const router = express.Router();

router.post(
  '/create-enrolled-course',
  Auth(User_Role.student),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  EnrolledCourseControllers.createEnrolledCourse,
);

export const EnrolledCourseRoutes = router;
