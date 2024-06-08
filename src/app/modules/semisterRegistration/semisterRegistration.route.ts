import express from 'express';
import { SemesterRegistrationController } from './semisterRegistration.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { semesterRegistationValidation } from './semisterRegistration.validation';

const router = express.Router();

router.post(
  '/create-semester-registation',
  validateRequest(
    semesterRegistationValidation.semesterRegistationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);
router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);
router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistration,
);

export const SemesterRegisterRouter = router;
