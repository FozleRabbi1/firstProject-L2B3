import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CoursesService } from './EnrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await CoursesService.createCourseIntoDB(userId, req?.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Enrolled successFully',
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
};
