import express from 'express';
import { CourseController } from './course.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { CourseValidationSchema } from './course.validation';
import { Auth } from '../../middleware/auth';
import { User_Role } from '../user/user.constent';

const router = express.Router();

router.post(
  '/create-course',
  Auth(User_Role.superAdmin, User_Role.admin),
  validateRequest(CourseValidationSchema.courseValidationSchema),
  CourseController.createCourse,
);
router.patch(
  '/:id',
  Auth(User_Role.superAdmin, User_Role.admin),
  validateRequest(CourseValidationSchema.updateCourseValidationSchema),
  CourseController.updateSingleCourse,
);
router.get(
  '/',
  Auth(
    User_Role.superAdmin,
    User_Role.admin,
    User_Role.faculty,
    User_Role.student,
  ),
  CourseController.getALlCourse,
);
router.get('/:id', CourseController.getSingleCourse);
router.delete(
  '/:id',
  Auth(User_Role.superAdmin, User_Role.admin),
  CourseController.deleteSingleCourse,
);
router.put(
  '/:courseId/assign-faculties',
  Auth(User_Role.superAdmin, User_Role.admin),
  validateRequest(CourseValidationSchema.CourseFacultyValidationSchema),
  CourseController.assignFacultiesWithCourse,
);

router.get(
  '/:courseId/get-faculties',
  Auth(
    User_Role.superAdmin,
    User_Role.admin,
    User_Role.faculty,
    User_Role.student,
  ),
  CourseController.getCoursesAllFaculty,
);

router.delete(
  '/:courseId/remove-faculties',
  Auth(User_Role.superAdmin, User_Role.admin),
  validateRequest(CourseValidationSchema.CourseFacultyValidationSchema),
  CourseController.deleteFacultiesFromCourse,
);

export const CourseRoutes = router;
