import express from 'express';
import { AcademicSemisterController } from './academicSemester.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { validateAcademicSemester } from './academicSemester.Validation';

const router = express.Router();

router.get('/:id', AcademicSemisterController.getSingleSemester);
router.patch('/:id', AcademicSemisterController.updateSingleSemester);
router.post(
  '/create-academic-semester',
  validateRequest(
    validateAcademicSemester.CreateAcademicSemesterSchemaValidation,
  ),
  AcademicSemisterController.createAcademicSemester,
);
router.get('/', AcademicSemisterController.getAllAcademicSemester);

export const AcademicSemisterRouter = router;
