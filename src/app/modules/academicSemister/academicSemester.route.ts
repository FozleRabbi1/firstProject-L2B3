import express from 'express';
import { AcademicSemisterController } from './academicSemester.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { validateAcademicSemester } from './academicSemester.Validation';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(
    validateAcademicSemester.CreateAcademicSemesterSchemaValidation,
  ),
  AcademicSemisterController.createAcademicSemester,
);

export const AcademicSemisterRouter = router;
