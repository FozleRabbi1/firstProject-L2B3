import express from 'express';
import { AcademicSemisterController } from './academicSemester.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { validateAcademicSemester } from './academicSemester.Validation';
import { Auth } from '../../middleware/auth';
import { User_Role } from '../user/user.constent';

const router = express.Router();

router.get(
  '/',
  Auth(User_Role.superAdmin, User_Role.admin),
  AcademicSemisterController.getAllAcademicSemester,
);
router.get(
  '/:id',
  Auth(User_Role.admin),
  AcademicSemisterController.getSingleSemester,
);
router.patch(
  '/:id',
  Auth(User_Role.admin),
  validateRequest(
    validateAcademicSemester.UpdateAcademicSemesterSchemaValidation,
  ),
  AcademicSemisterController.updateSingleSemester,
);
router.post(
  '/create-academic-semester',
  Auth(User_Role.superAdmin, User_Role.admin),
  validateRequest(
    validateAcademicSemester.CreateAcademicSemesterSchemaValidation,
  ),
  AcademicSemisterController.createAcademicSemester,
);

export const AcademicSemisterRouter = router;
