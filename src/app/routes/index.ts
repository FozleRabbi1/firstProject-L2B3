import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRouter } from '../modules/user/user.route';
import { AcademicSemisterRouter } from '../modules/academicSemister/academicSemester.route';
import { AcademicFacultyRoute } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { FacultyRouter } from '../modules/faculty/faculty.route';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { CourseRoutes } from '../modules/course/course.route';
import { SemesterRegisterRouter } from '../modules/semisterRegistration/semisterRegistration.route';

const router = Router();

const moduleRoutes = [
  { path: '/users', route: UserRouter },
  { path: '/admin', route: AdminRoutes },
  { path: '/courses', route: CourseRoutes },
  { path: '/students', route: StudentRoutes },
  { path: '/faculties', route: FacultyRouter },
  { path: '/academic-faculties', route: AcademicFacultyRoute },
  { path: '/academic-semister', route: AcademicSemisterRouter },
  { path: '/semester-registation', route: SemesterRegisterRouter },
  { path: '/academic-departments', route: AcademicDepartmentRoutes },
];
// router.use('/users', UserRouter);
//এখানে map use করা লাগবে না , কারন এখানে আমাদের কোন কিছু return করা লাগবে না , তাই forEach use করা হয়েছে , কারন forEach কোন কিছু return করে না
moduleRoutes.forEach((pathRouter) =>
  router.use(pathRouter.path, pathRouter.route),
);

export default router;
