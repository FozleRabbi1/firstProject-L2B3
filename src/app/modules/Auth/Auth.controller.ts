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
    // sameSite: true,
    // maxAge: 1000 * 60 * 60 * 24 * 365,
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

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await UsersLoginService.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access is token retrived successfully',
    data: result,
  });
});

const forgatePassword = catchAsync(async (req, res) => {
  const { id } = req.body;
  const result = await UsersLoginService.forgatePasswordServer(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link is generated  successfully',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { id, newPassword } = req.body;
  const token = req.headers.authorization;
  const result = await UsersLoginService.resetPasswordServer(
    id,
    newPassword,
    token as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Reset successfully',
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  resetPassword,
  passwordChange,
  forgatePassword,
};
