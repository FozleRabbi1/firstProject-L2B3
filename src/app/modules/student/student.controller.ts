/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const getAllStudents = catchAsync(async (req, res, next) => {
  const result = await StudentServices.getAllStudentFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students are retrive successfully',
    data: result,
  });
});

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const getSingleStudent: RequestHandler = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student is retrived successfully',
    data: result,
  });
});

const deleteSingleStudent: RequestHandler = catchAsync(
  //  eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async (req, res, next) => {
    const { studentId } = req.params;
    const result = await StudentServices.DeleteSingleStudentFromDB(studentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'studen wes deleted successfully',
      data: result,
    });
  },
);

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
};
