import express from 'express';
import { academicController } from './academicFaculty.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(academicFacultyValidation.academicFacultyValidationSchema),
  academicController.createAcademicFaculty,
);
router.get('/', academicController.getAllAcademicFaculty);
router.get('/:facultyId', academicController.getSingleAcademicFaculty);
router.patch(
  '/:facultyId',
  validateRequest(
    academicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  academicController.updateSingleAcademicFaculty,
);

export const AcademicFacultyRoute = router;
