import { Router } from 'express';
import { StudentController } from './student.controller';

const router = Router();

// we call controller function
router.get('/', StudentController.getAllStudents);
router.post('/create-student', StudentController.createStudent);
router.get('/:studentId', StudentController.getSingleStudent);

export const StudentRoutes = router;
