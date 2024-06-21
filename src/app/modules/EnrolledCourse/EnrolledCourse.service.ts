import { TEnrolledCourse } from './EnrolledCourse.interface';

const createCourseIntoDB = async (
  userId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  console.log({ userId, payload });
};

export const CoursesService = {
  createCourseIntoDB,
};
