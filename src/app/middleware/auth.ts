import httpStatus from 'http-status';
import { AppError } from '../errors/AppErrors';
import { catchAsync } from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

// একখানে parameter হিসেবে একটি array আসবে ,,,,, (vdo : 8:52---M 17.7)
export const Auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    // if the toke send from the client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorize!');
    }
    // check if the token is valid or not
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorize!');
        }

        const role = (decoded as JwtPayload).role;
        console.log(role);
        console.log(requiredRole);
        if (requiredRole && !requiredRole.includes(role)) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorize!');
        }

        req.user = decoded as JwtPayload;
        next();
      },
    );
  });
};
