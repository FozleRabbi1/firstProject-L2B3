/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import core from 'cors';
import { StudentRoutes } from './app/modules/student/student.route';
import { UserRouter } from './app/modules/user/user.route';
import globalErrorHandler from './app/middleware/globalErrorHandlear';
import notFound from './app/middleware/notFound';
const app: Application = express();

//parser
app.use(express.json());
app.use(core());

// application routes
app.use('/api/v1/students', StudentRoutes);
app.use('/api/v1/users', UserRouter);

app.use(globalErrorHandler);
app.use('*', notFound);

export default app;
