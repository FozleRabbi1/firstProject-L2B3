import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CoursesService } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await CoursesService.createCourseIntoDB(req?.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course create successFully',
    data: result,
  });
});

const getALlCourse = catchAsync(async (req, res) => {
  const result = await CoursesService.getAllCoursesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get all course successFully',
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const result = await CoursesService.getSingleCourseFromDB(req?.params?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get all course successFully',
    data: result,
  });
});

const deleteSingleCourse = catchAsync(async (req, res) => {
  const result = await CoursesService.deleteCourseFromDB(req?.params?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get all course successFully',
    data: result,
  });
});

const updateSingleCourse = catchAsync(async (req, res) => {
  const result = await CoursesService.updateSingleCourseIntoDB(
    req?.params?.id,
    req?.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update course successFully',
    data: result,
  });
});

const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const result = await CoursesService.assignFacultiesWithCourseIntoDB(
    req?.params?.courseId,
    req?.body.faculties,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'assign course faculties successFully',
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getALlCourse,
  getSingleCourse,
  deleteSingleCourse,
  updateSingleCourse,
  assignFacultiesWithCourse,
};
