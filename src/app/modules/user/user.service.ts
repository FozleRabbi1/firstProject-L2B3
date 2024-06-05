/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemister/academicSemester.model';
import { TStudent } from '../student/studen.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateFacultyId, generateStudentId } from './user.utils';
import { AppError } from '../../errors/AppErrors';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import Faculty from '../faculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';

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

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};
  userData.password = password || config.default_password;
  userData.role = 'faculty';
  // userData.id = 'F-0002';

  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (academicDepartment) {
      userData.id = await generateFacultyId();
    }
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'faield to create User');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const faculty = await Faculty.create([payload], { session });
    if (!faculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'faield to create Faculty');
    }
    await session.commitTransaction();
    await session.endSession();
    return faculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
};
