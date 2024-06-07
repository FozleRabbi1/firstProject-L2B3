import express from 'express';
import { CourseController } from './course.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { CourseValidationSchema } from './course.validation';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidationSchema.courseValidationSchema),
  CourseController.createCourse,
);
router.patch(
  '/:id',
  validateRequest(CourseValidationSchema.updateCourseValidationSchema),
  CourseController.updateSingleCourse,
);
router.get('/', CourseController.getALlCourse);
router.get('/:id', CourseController.getSingleCourse);
router.delete('/:id', CourseController.deleteSingleCourse);
router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidationSchema.CourseFacultyValidationSchema),
  CourseController.assignFacultiesWithCourse,
);
router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidationSchema.CourseFacultyValidationSchema),
  CourseController.deleteFacultiesFromCourse,
);

export const CourseRoutes = router;
