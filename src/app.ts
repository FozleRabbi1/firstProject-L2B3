/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middleware/globalErrorHandlear';
const app: Application = express();

//parser
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

// application routes
app.use('/api/v1', router);

app.get('/test', async (req, res) => {
  //   Promise.reject();
  const a = 'test';
  res.send(a);
});

app.use(globalErrorHandler);
app.use('*', notFound);

export default app;
