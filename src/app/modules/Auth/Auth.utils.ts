import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

// ------------------------->>>>>>>> এই code কে উপরের code এ convert করা হয়েছে ,,,,
// const refreshToken = jwt.sign(
//     jwtPayload,
//     config.jwt_refresh_secret as string,
//     {
//       expiresIn: config.jwt_refresh_expires_in,
//     },
//   );
