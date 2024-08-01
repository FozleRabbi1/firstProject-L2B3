import express from 'express';
import { SemesterRegistrationController } from './semisterRegistration.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { semesterRegistationValidation } from './semisterRegistration.validation';
import { Auth } from '../../middleware/auth';
import { User_Role } from '../user/user.constent';

const router = express.Router();

router.post(
  '/create-semester-registation',
  Auth(User_Role.superAdmin, User_Role.admin),
  validateRequest(
    semesterRegistationValidation.semesterRegistationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);
router.get(
  '/',
  Auth(
    User_Role.superAdmin,
    User_Role.admin,
    User_Role.faculty,
    User_Role.student,
  ),
  SemesterRegistrationController.getAllSemesterRegistrations,
);
router.get(
  '/:id',
  Auth(
    User_Role.superAdmin,
    User_Role.admin,
    User_Role.faculty,
    User_Role.student,
  ),
  SemesterRegistrationController.getSingleSemesterRegistration,
);
router.patch(
  '/:id',
  Auth(User_Role.superAdmin, User_Role.admin),
  validateRequest(
    semesterRegistationValidation.updateSemesterRegistationValidationSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistration,
);

export const SemesterRegisterRouter = router;
