import { Router } from 'express';
import { StudentController } from './student.controller';

const router = Router();

// we call controller function
router.post('/create-student', StudentController.createStudent);

export const StudentRoutes = router;
