import { Router } from 'express';
import { StudentController } from './student.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { studentValidatiSchema } from './student.validation';

const router = Router();

// we call controller function
router.get('/', StudentController.getAllStudents);
router.get('/:studentId', StudentController.getSingleStudent);
router.patch(
  '/:studentId',
  validateRequest(studentValidatiSchema.updateStudentValidationSchema),
  StudentController.updatedStudent,
);
router.delete('/:studentId', StudentController.deleteSingleStudent);

export const StudentRoutes = router;
