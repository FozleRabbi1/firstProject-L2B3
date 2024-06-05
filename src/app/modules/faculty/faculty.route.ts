import express from 'express';
import { FacultyController } from './faculty.controllerl';

const router = express.Router();

router.get('/deleted-faculties', FacultyController.deletedFaculty);
router.get('/:facultyId', FacultyController.getSingleFaculty);
router.patch('/:facultyId', FacultyController.updateSingleFaculty);
router.delete('/:facultyId', FacultyController.deleteSingleFaculty);
router.get('/', FacultyController.getAllFaculty);

export const FacultyRouter = router;
