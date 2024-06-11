import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UsersLoginService } from './Auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await UsersLoginService.loginUserService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is loged in successfully',
    data: result,
  });
});

export const AuthController = {
  loginUser,
};
    