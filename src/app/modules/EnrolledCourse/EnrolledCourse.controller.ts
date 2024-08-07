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

const getMyEnrolledCourses = catchAsync(async (req, res) => {
  const studentId = req.user.userId;
  const result = await CoursesService.getMyEnrolledCoursesFromDB(
    studentId,
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled courses are retrivied succesfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const facultyId = req.user.userId;
  const result = await CoursesService.updateEnrolledCourseMarksIntoDB(
    facultyId,
    req?.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update Enrolled successFully',
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
  getMyEnrolledCourses,
  updateEnrolledCourseMarks,
};
