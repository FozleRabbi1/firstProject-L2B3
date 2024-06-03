/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemister/academicSemester.model';
import { TStudent } from '../student/studen.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import { AppError } from '../../errors/AppErrors';
import httpStatus from 'http-status';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a object
  const userData: Partial<TUser> = {};
  // if password is not given , use default password
  userData.password = password || (config.default_password as string);
  // set student role
  userData.role = 'student';

  const admissionSemesterData = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  // =====================================>>>>>>>>>>>>>>>>>> create session
  const session = await mongoose.startSession();
  try {
    // =====================================>>>>>>>>>>>>>>>>>> start Transaction
    session.startTransaction();
    if (admissionSemesterData) {
      // set dynamic generated id
      userData.id = await generateStudentId(admissionSemesterData);
    }
    // =====================================>>>>>>>>>>>>>>>>>>  Transaction --- 1
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Faild to create User');
    }
    payload.id = newUser[0].id; // this is embedding Id
    payload.user = newUser[0]._id; // this is reference Id

    // =====================================>>>>>>>>>>>>>>>>>>  Transaction --- 2
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Faild to create Student');
    }
    await session.commitTransaction(); // এর ফলে data permantly DB তে save হয়ে যাবে
    await session.endSession(); // এখানে session কে শেষ করা হয়েছে
    return newStudent;
  } catch (err: any) {
    await session.abortTransaction(); // এর ফলে session টি RollBack করবে
    await session.endSession(); //আর এখানে session কে শেষ করা হয়েছে
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentIntoDB,
};
