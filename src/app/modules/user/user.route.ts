import express from 'express';
import { userController } from './user.controller';
import { studentValidatiSchema } from '../student/student.validation';
import { validateRequest } from '../../middleware/validateRequest';
import { facultyCreateValidationSchema } from '../faculty/faculty.validation';
import { adminCreateValidationSchema } from '../Admin/admin.validation';
import { Auth } from '../../middleware/auth';
import { User_Role } from './user.constent';

const router = express.Router();

router.post(
  '/create-student',
  Auth(User_Role.admin),
  validateRequest(studentValidatiSchema.createStudentValidationSchema),
  userController.createStudent,
);
router.post(
  '/create-faculty',
  Auth(User_Role.admin),
  validateRequest(facultyCreateValidationSchema.FacultyCreateValidationSchema),
  userController.createFaculty,
);
router.post(
  '/create-admin',
  // Auth(User_Role.admin),
  validateRequest(adminCreateValidationSchema.AdminCreateValidationSchema),
  userController.createAdmin,
);

router.get(
  '/me',
  Auth(User_Role.admin, User_Role.faculty, User_Role.student),
  userController.getMe,
);

export const UserRouter = router;
