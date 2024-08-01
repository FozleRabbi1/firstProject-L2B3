import express from 'express';
import { OfferedCourseController } from './OfferedCourse.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { OfferedCOurseValidationSchema } from './OfferedCourse.validation';
import { Auth } from '../../middleware/auth';
import { User_Role } from '../user/user.constent';

const router = express.Router();

router.get(
  '/',
  Auth(User_Role.superAdmin, User_Role.admin, User_Role.faculty),
  OfferedCourseController.getALlOfferedCourse,
);

router.get(
  '/my-offered-courses',
  Auth(User_Role.student),
  OfferedCourseController.getMyOfferedCourse,
);

router.get(
  '/:id',
  Auth(
    User_Role.superAdmin,
    User_Role.admin,
    User_Role.faculty,
    User_Role.student,
  ),
  OfferedCourseController.getSingleOfferedCourse,
);
router.delete(
  '/:id',
  Auth(User_Role.superAdmin, User_Role.admin),
  OfferedCourseController.deleteOfferedCourse,
);

router.post(
  '/create-offered-course',
  Auth(User_Role.superAdmin, User_Role.admin),
  validateRequest(OfferedCOurseValidationSchema.offeredCourseValidationSchema),
  OfferedCourseController.createOfferedCourse,
);

router.patch(
  '/:id',
  Auth(User_Role.superAdmin, User_Role.admin),
  validateRequest(
    OfferedCOurseValidationSchema.updateOfferedCourseValidationSchema,
  ),
  OfferedCourseController.updateOfferedCourse,
);

export const OfferedCourseRouter = router;
