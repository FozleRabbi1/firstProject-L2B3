/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import core from 'cors';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandlear';
const app: Application = express();

//parser
app.use(express.json());
app.use(core());

// application routes
app.use('/api/v1', router);

app.use(globalErrorHandler);
app.use('*', notFound);

export default app;
