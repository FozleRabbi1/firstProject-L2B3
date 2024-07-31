import express from 'express';
import { FacultyController } from './faculty.controllerl';
import { validateRequest } from '../../middleware/validateRequest';
import { facultyCreateValidationSchema } from './faculty.validation';
import { Auth } from '../../middleware/auth';
import { User_Role } from '../user/user.constent';

const router = express.Router();

router.get(
  '/deleted-faculties',
  Auth(User_Role.superAdmin, User_Role.admin, User_Role.faculty),
  FacultyController.deletedFaculty,
);
router.get(
  '/:facultyId',
  Auth(User_Role.superAdmin, User_Role.admin, User_Role.faculty),
  FacultyController.getSingleFaculty,
);
router.patch(
  '/:facultyId',
  Auth(User_Role.superAdmin, User_Role.admin, User_Role.faculty),
  validateRequest(
    facultyCreateValidationSchema.updateFacultyCreateValidationSchema,
  ),
  FacultyController.updateSingleFaculty,
);
router.delete(
  '/:facultyId',
  Auth(User_Role.superAdmin, User_Role.admin, User_Role.faculty),
  FacultyController.deleteSingleFaculty,
);
router.get(
  '/',
  Auth(User_Role.superAdmin, User_Role.admin, User_Role.faculty),
  FacultyController.getAllFaculty,
);

export const FacultyRouter = router;
