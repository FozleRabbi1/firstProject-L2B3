import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyService } from './faculty.server';

const getAllFaculty = catchAsync(async (req, res) => {
  console.log('test', req.user);
  const result = await FacultyService.getAllFacultyFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get All Faculty',
    data: result,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const result = await FacultyService.getSingleFacultyFromDB(
    req.params.facultyId as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Single Faculty!!',
    data: result,
  });
});

const updateSingleFaculty = catchAsync(async (req, res) => {
  const result = await FacultyService.updateSingleFaculty(
    req.params.facultyId as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty update successfully!',
    data: result,
  });
});

const deleteSingleFaculty = catchAsync(async (req, res) => {
  const result = await FacultyService.deleteSingleFacultyData(
    req.params.facultyId as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty delete successfully',
    data: result,
  });
});

const deletedFaculty = catchAsync(async (req, res) => {
  const result = await FacultyService.getDeletedFacultiesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty delete successfully',
    data: result,
  });
});

export const FacultyController = {
  getAllFaculty,
  getSingleFaculty,
  updateSingleFaculty,
  deleteSingleFaculty,
  deletedFaculty,
};
