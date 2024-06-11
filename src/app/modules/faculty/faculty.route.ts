import express from 'express';
import { FacultyController } from './faculty.controllerl';
import { validateRequest } from '../../middleware/validateRequest';
import { facultyCreateValidationSchema } from './faculty.validation';
import { Auth } from '../../middleware/auth';

const router = express.Router();

router.get('/deleted-faculties', FacultyController.deletedFaculty);
router.get('/:facultyId', FacultyController.getSingleFaculty);
router.patch(
  '/:facultyId',
  validateRequest(
    facultyCreateValidationSchema.updateFacultyCreateValidationSchema,
  ),
  FacultyController.updateSingleFaculty,
);
router.delete('/:facultyId', FacultyController.deleteSingleFaculty);
router.get('/', Auth(), FacultyController.getAllFaculty);

export const FacultyRouter = router;
