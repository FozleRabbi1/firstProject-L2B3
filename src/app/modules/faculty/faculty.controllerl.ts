import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyService } from './faculty.server';

const getAllFaculty = catchAsync(async (req, res) => {
  const result = await FacultyService.getAllFacultyFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get All Faculty',
    data: result,
  });
});

export const FacultyController = {
  getAllFaculty,
};
