import express from 'express';
import { userController } from './user.controller';
import { studentValidatiSchema } from '../student/student.validation';
import { validateRequest } from '../../middleware/validateRequest';
import { facultyCreateValidationSchema } from '../faculty/faculty.validation';
import { adminCreateValidationSchema } from '../Admin/admin.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidatiSchema.createStudentValidationSchema),
  userController.createStudent,
);
router.post(
  '/create-faculty',
  validateRequest(facultyCreateValidationSchema.FacultyCreateValidationSchema),
  userController.createFaculty,
);
router.post(
  '/create-admin',
  validateRequest(adminCreateValidationSchema.AdminCreateValidationSchema),
  userController.createAdmin,
);

export const UserRouter = router;
