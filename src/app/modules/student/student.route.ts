import { Router } from 'express';
import { StudentController } from './student.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { studentValidatiSchema } from './student.validation';
import { Auth } from '../../middleware/auth';
import { User_Role } from '../user/user.constent';

const router = Router();

// we call controller function
router.get(
  '/',
  Auth(User_Role.superAdmin, User_Role.admin, User_Role.faculty),
  StudentController.getAllStudents,
);
router.get(
  '/:studentId',
  Auth(User_Role.superAdmin, User_Role.admin, User_Role.faculty),
  StudentController.getSingleStudent,
);
router.patch(
  '/:studentId',
  Auth(User_Role.superAdmin, User_Role.admin),
  validateRequest(studentValidatiSchema.updateStudentValidationSchema),
  StudentController.updatedStudent,
);
router.delete(
  '/:studentId',
  Auth(User_Role.superAdmin, User_Role.admin),
  StudentController.deleteSingleStudent,
);

export const StudentRoutes = router;
