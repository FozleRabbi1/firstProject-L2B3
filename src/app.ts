import express, { Application, Request, Response } from 'express';
import core from 'cors';
import { StudentRoutes } from './app/modules/student/student.route';
import { UserRouter } from './app/modules/user/user.route';
const app: Application = express();

//parser
app.use(express.json());
app.use(core());

// application routes
app.use('/api/v1/students', StudentRoutes);
app.use('/api/v1/users', UserRouter);

app.use('*', (req: Request, res: Response) => {
  res.send({
    success: false,
    message: 'route not found',
  });
});

export default app;
