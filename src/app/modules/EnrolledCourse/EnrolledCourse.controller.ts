import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CoursesService } from './EnrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const result = await CoursesService.createCourseIntoDB(req?.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course create successFully',
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
};
