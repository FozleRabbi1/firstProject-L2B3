import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRouter } from '../modules/user/user.route';
import { AcademicSemisterRouter } from '../modules/academicSemister/academicSemester.route';

const router = Router();

const moduleRoutes = [
  { path: '/users', route: UserRouter },
  { path: '/students', route: StudentRoutes },
  { path: '/academic-semister', route: AcademicSemisterRouter },
];
// router.use('/users', UserRouter);
//এখানে map use করা লাগবে না , কারন এখানে আমাদের কোন কিছু return করা লাগবে না , তাই forEach use করা হয়েছে , কারন forEach কোন কিছু return করে না
moduleRoutes.forEach((pathRouter) =>
  router.use(pathRouter.path, pathRouter.route),
);

export default router;
