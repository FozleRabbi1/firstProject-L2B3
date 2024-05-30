import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.createAcademicSemesterIntoDB(
    req?.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester created successfully',
    data: result,
  });
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getAllAcademicSemesterFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get all semester successfully',
    data: result,
  });
});

const getSingleSemester = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await academicSemesterServices.getSingleSemesterFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get single semester successfully',
    data: result,
  });
});

const updateSingleSemester = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const result = await academicSemesterServices.updateSingleSemesterFromDB(
    id,
    data,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'update single semester successfully',
    data: result,
  });
});

export const AcademicSemisterController = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleSemester,
  updateSingleSemester,
};
