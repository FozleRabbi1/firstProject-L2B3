import httpStatus from 'http-status';
import { AppError } from '../../errors/AppErrors';
import { User } from '../user/user.model';
import { TLoginUser } from './Auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
// import bcrypt from 'bcrypt';

const loginUserService = async (paylod: TLoginUser) => {
  // =================================>>>>> checking if the user is exists or not
  // const isUserExixts = await User.findOne({ id: paylod?.id });
  // if (!isUserExixts) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  // }
  // // ================================>>>>>  checking if the user is already deleted or not
  // if (isUserExixts?.isDeleted) {
  //   throw new AppError(httpStatus.FORBIDDEN, 'User is already deleted');
  // }
  // // =================================>>>>>  checking if the user is already Blocked  or in-progress
  // if (isUserExixts?.status !== 'in-progress') {
  //   throw new AppError(httpStatus.FORBIDDEN, 'User is already Blocked');
  // }
  // // =================================>>>>>  checking if the password is correct
  // const isPasswordMatched = await bcrypt.compare(
  //   paylod?.password,
  //   isUserExixts?.password,
  // );
  // if (!isPasswordMatched) {
  //   throw new AppError(httpStatus.FORBIDDEN, 'password is not matching');
  // }

  // ========================================>>>>>>>>>> STATICKS method
  const userData = await User.isUserExistsByCustomeId(paylod.id);

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }
  // =================================>>>>>  checking if the password is correct or not
  if (!(await User.isPasswordMatched(paylod?.password, userData?.password))) {
    // console.log(paylod.password, userData.password);
    throw new AppError(httpStatus.FORBIDDEN, 'password is not matched');
  }
  // ================================>>>>>  checking if the user is already deleted or not
  if (userData?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is already deleted');
  }
  // =================================>>>>>  checking if the user is already Blocked  or in-progress
  if (userData?.status !== 'in-progress') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is already Blocked');
  }

  const jwtPayload = {
    userId: userData.id,
    role: userData.role,
  };
  // =========== jwt এর builting function
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (
  user: JwtPayload,
  paylod: { oldPassword: string; newPassword: string },
) => {
  const userData = await User.isUserExistsByCustomeId(user.userId);

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }
  // =================================>>>>>  checking if the password is correct or not
  if (
    !(await User.isPasswordMatched(paylod?.oldPassword, userData?.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'password is not matching');
  }
  // ================================>>>>>  checking if the user is already deleted or not
  if (userData?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is already deleted');
  }
  // =================================>>>>>  checking if the user is already Blocked  or in-progress
  if (userData?.status !== 'in-progress') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is already Blocked');
  }

  const newPassword = await bcrypt.hash(
    paylod.newPassword,
    Number(config.bcrypt_salt_round),
  );

  const result = await User.findOneAndUpdate(
    {
      id: userData.id,
      role: userData.role,
    },
    {
      password: newPassword,
      needPasswordChange: false,
      passwordChangeAt: new Date(),
    },
    { new: true },
  );

  return result;
};

export const UsersLoginService = {
  loginUserService,
  changePassword,
};
