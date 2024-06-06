import express from 'express';
import { CourseController } from './course.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { CourseValidationSchema } from './course.validation';

const router = express.Router();

router.get(
  '/create-course',
  validateRequest(CourseValidationSchema.courseValidationSchema),
  CourseController.createCourse,
);
router.get('/', CourseController.getALlCourse);
router.get('/:id', CourseController.getSingleCourse);
router.delete('/:id', CourseController.deleteSingleCourse);

export const CourseRoutes = router;
