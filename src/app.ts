/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import core from 'cors';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middleware/globalErrorHandlear';
const app: Application = express();

//parser
app.use(express.json());
app.use(cookieParser());
app.use(core({ origin: ['http://localhost:5173'] }));

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


// {
//   "password": "student123",
//   "student": {
//       "name": {
//           "firstName": " fozle ",
//           "middleName": "rabbi",
//           "lastName": "shuvo "
//       },
//       "gender": "male",
//       "email": "fozlerabbi9790@gmail.com",
//       "dethOfBirth": "1990-01-01",
//       "contactNumber": "+1234567890",
//       "emergencyContactNo": "+0987654321",
//       "bloodGroup": "O+",
//       "presentAddress": "123 Main St, Springfield, IL",
//       "permanentAddress": "456 Elm St, Springfield, IL",
//       "guardian": {
//           "fatherName": "Robert Doe",
//           "fatherOccupation": "Engineer",
//           "fatherContactNo": "+1234567891",
//           "motherName": "Jane Doe",
//           "motherOccupation": "Teacher",
//           "motherContactNo": "+1234567892"
//       },
//       "localguardian": {
//           "name": "Uncle Bob",
//           "occupation": "Doctor",
//           "contactNo": "+1234567893",
//           "address": "789 Maple St, Springfield, IL"
//       },
//       "academicDepartment": "665d7e67e99ae88a986cf356",
//       "admissionSemester": "665887afdc3ec6a254a29b6c",
//       "profileImg": "https://example.com/images/johndoe.jpg"
//   }
// }