import { Router } from 'express';
import { StudentController } from './student.controller';

const router = Router();

// we call controller function
router.get('/', StudentController.getAllStudents);
router.get('/:studentId', StudentController.getSingleStudent);
router.delete('/:studentId', StudentController.deleteSingleStudent);

export const StudentRoutes = router;
