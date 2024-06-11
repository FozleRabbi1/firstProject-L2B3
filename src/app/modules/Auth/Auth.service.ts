import httpStatus from 'http-status';
import { AppError } from '../../errors/AppErrors';
import { User } from '../user/user.model';
import { TLoginUser } from './Auth.interface';
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


  // ========================================>>>>>>>>>> statices method
  const userData = await User.isUserExistsByCustomeId(paylod.id);

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  if (!(await User.isPasswordMatched(paylod?.password, userData?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'password is not matching');
  }

  return {};
};

export const UsersLoginService = {
  loginUserService,
};
