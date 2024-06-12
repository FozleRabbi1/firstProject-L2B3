import express from 'express';
import { academicController } from './academicFaculty.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validation';
import { Auth } from '../../middleware/auth';
import { User_Role } from '../user/user.constent';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(academicFacultyValidation.academicFacultyValidationSchema),
  academicController.createAcademicFaculty,
);
router.get(
  '/',
  Auth(User_Role.admin, User_Role.faculty),
  academicController.getAllAcademicFaculty,
);
router.get('/:facultyId', academicController.getSingleAcademicFaculty);
router.patch(
  '/:facultyId',
  validateRequest(
    academicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  academicController.updateSingleAcademicFaculty,
);

export const AcademicFacultyRoute = router;
