import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createAcademicSemester = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester reated successfully',
    data: result,
  });
});

export const AcademicSemisterController = {
  createAcademicSemester,
};
