import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferedCourseService } from './OfferedCourse.service';

const getALlOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseService.getAllOfferedCourseFromDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get All Offered Course SuccessFully',
    data: result.result,
    meta: result.meta,
  });
});

const getMyOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseService.getMyOfferedCourseFromDB(
    req.user.userId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get My Offered Course SuccessFully',
    data: result,
  });
});

const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseService.getSingleOfferedCourseFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Single Offered Course SuccessFully',
    data: result,
  });
});

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseService.createOfferedCourseFromDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Create Offered Course SuccessFully',
    data: result,
  });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseService.updateCourseIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update Offered Course SuccessFully',
    data: result,
  });
});

const deleteOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseService.deleteOfferedCourseFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delete Offered Course SuccessFully',
    data: result,
  });
});

export const OfferedCourseController = {
  getALlOfferedCourse,
  getMyOfferedCourse,
  createOfferedCourse,
  updateOfferedCourse,
  getSingleOfferedCourse,
  deleteOfferedCourse,
};
