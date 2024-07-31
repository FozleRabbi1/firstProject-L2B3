import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import { studentValidatiSchema } from '../student/student.validation';
import { validateRequest } from '../../middleware/validateRequest';
import { facultyCreateValidationSchema } from '../faculty/faculty.validation';
import { adminCreateValidationSchema } from '../Admin/admin.validation';
import { Auth } from '../../middleware/auth';
import { User_Role } from './user.constent';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-student',
  Auth(User_Role.superAdmin, User_Role.admin),
  // =====>>> validationSchema এর আগে file uploader middlewaer set করতে হবে ... এখানে multer এর সাহায্যে data parse হচ্ছে
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    // এখানে form data থেকে আশা text format এর data কে json format এ convert করা হচ্ছে ( video : 16:00 + -)
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidatiSchema.createStudentValidationSchema),
  userController.createStudent,
);

router.post(
  '/create-faculty',
  Auth(User_Role.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(facultyCreateValidationSchema.FacultyCreateValidationSchema),
  userController.createFaculty,
);
router.post(
  '/create-admin',
  // Auth(User_Role.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(adminCreateValidationSchema.AdminCreateValidationSchema),
  userController.createAdmin,
);

router.get(
  '/me',
  Auth(User_Role.admin, User_Role.faculty, User_Role.student),
  userController.getMe,
);

router.get(
  '/change-status/:id',
  Auth(User_Role.admin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  userController.changeStatus,
);

export const UserRouter = router;
