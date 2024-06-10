import express from 'express';
import { OfferedCourseController } from './OfferedCourse.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { OfferedCOurseValidationSchema } from './OfferedCourse.validation';

const router = express.Router();

router.post(
  '/create-offered-course',
  validateRequest(OfferedCOurseValidationSchema.offeredCourseValidationSchema),
  OfferedCourseController.createOfferedCourse,
);

router.patch(
  '/:id',
  validateRequest(
    OfferedCOurseValidationSchema.updateOfferedCourseValidationSchema,
  ),
  OfferedCourseController.updateOfferedCourse,
);

export const OfferedCourseRouter = router;
