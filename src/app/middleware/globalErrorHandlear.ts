import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import config from '../config';
import { TErrorSource } from '../interface/error';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // settings default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Somthing went wrong!';
  let errorSourse: TErrorSource = [
    {
      path: '',
      message: 'Somthing went wrong!!',
    },
  ];

  const handleZodError = (err: ZodError) => {
    const errorSourse: TErrorSource = err.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1],
        message: issue?.message,
      };
    });
    const statusCode = 400;
    return {
      statusCode,
      message: 'Validation Error',
      errorSourse,
    };
  };

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSourse = simplifiedError?.errorSourse;
  }

  // ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSourse,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
