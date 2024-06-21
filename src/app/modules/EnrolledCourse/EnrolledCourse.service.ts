import { TEnrolledCourse } from './EnrolledCourse.interface';

const createCourseIntoDB = async (payload: TEnrolledCourse) => {
  console.log(payload);
};

export const CoursesService = {
  createCourseIntoDB,
};
