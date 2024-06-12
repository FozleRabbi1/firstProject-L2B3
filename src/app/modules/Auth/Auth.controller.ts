import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UsersLoginService } from './Auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await UsersLoginService.loginUserService(req.body);
  const { refreshToken, accessToken, needPasswordChange } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is loged in successfully',
    data: {
      accessToken,
      needPasswordChange,
    },
  });
});

const passwordChange = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  const result = await UsersLoginService.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'password change successfully',
    data: result,
  });
});

export const AuthController = {
  loginUser,
  passwordChange,
};
