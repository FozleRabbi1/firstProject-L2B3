import httpStatus from 'http-status';
import { AppError } from '../errors/AppErrors';
import { catchAsync } from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

// একখানে parameter হিসেবে একটি array আসবে ,,,,, (vdo : 8:52---M 17.7)
export const Auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    // if the toke send from the client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorize!');
    }
    // check if the token is valid or not
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    // iat  এর অর্থ হল JWT কোন time এ issue হয়েছিল বা create হয়েছিল তার সময় ,,,,,
    const { role, userId: id, iat } = decoded;

    // ========================================>>>>>>>>>> STATICKS method
    const userData = await User.isUserExistsByCustomeId(id);

    if (!userData) {
      throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
    }
    // ================================>>>>>  checking if the user is already deleted or not
    if (userData?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'User is already deleted');
    }
    // =================================>>>>>  checking if the user is already Blocked  or in-progress
    if (userData?.status !== 'in-progress') {
      throw new AppError(httpStatus.FORBIDDEN, 'User is already Blocked');
    }

    if (
      userData.passwordChangeAt &&
      User.isJWTIssuedBeforePasswordChange(
        userData.passwordChangeAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorize!!!');
    }
    
    if (requiredRole && !requiredRole.includes(role)) {
      // requiredRole এই paramiter array এর মধ্যে role টা আছে কি না তা check করবে
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorize!!!');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
