/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemister/academicSemester.model';
import { TStudent } from '../student/studen.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateFacultyId,
  generateStudentId,
  generatedAdminId,
} from './user.utils';
import { AppError } from '../../errors/AppErrors';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import Faculty from '../faculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Admin } from '../Admin/admin.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent,
) => {
  // create a object
  const userData: Partial<TUser> = {};
  // if password is not given , use default password
  userData.password = password || (config.default_password as string);
  // set student role
  userData.role = 'student';
  userData.email = payload.email;
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
    // =====================================>>> send image to cloudinary
    const imageName = `${userData.id}${payload?.name.firstName}`;
    const { secure_url } = await sendImageToCloudinary(file?.path, imageName);

    // =====================================>>>>>>>>>>>>>>>>>>  Transaction --- 1
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Faild to create User');
    }
    payload.id = newUser[0].id; // this is embedding Id
    payload.user = newUser[0]._id; // this is reference Id
    payload.profileImg = secure_url;
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

// =============================>>>>>>>>>>>>>>>> Create Faculty
const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  const userData: Partial<TUser> = {};
  userData.password = password || config.default_password;
  userData.role = 'faculty';
  userData.email = payload.email;
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateFacultyId();

    const imageName = `${userData.id}${payload?.name.firstName}`;
    const { secure_url } = await sendImageToCloudinary(file?.path, imageName);

    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'faield to create User');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    payload.profileImg = secure_url;

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

// =============================>>>>>>>>>>>>>>>> Create Faculty
const createAdminFromDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  const userData: Partial<TUser> = {};
  userData.password = password || config.default_password;
  userData.role = 'admin';
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    userData.id = await generatedAdminId();

    const imageName = `${userData.id}${payload?.name.firstName}`;
    const { secure_url } = await sendImageToCloudinary(file?.path, imageName);

    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Faield to create User');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    payload.profileImg = secure_url;

    const admin = await Admin.create([payload], { session });
    if (!admin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Faield to create Admin');
    }
    await session.commitTransaction();
    await session.endSession();
    return admin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// type UserResult = {} | null;
const getMeFromDB = async (userId: string, role: string) => {
  let result = null;

  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate([
      { path: 'user' },
      { path: 'academicDepartment' },
      { path: 'admissionSemester' },
    ]);
  } else if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  } else {
    result = await Faculty.findOne({ id: userId }).populate([
      { path: 'user' },
      { path: 'academicDepartment' },
    ]);
  }
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Data Not Found');
  }

  return result;
};

const changeStatusIntoDB = async (id: string, status: string) => {
  const result = await User.findByIdAndUpdate(id, { status }, { new: true });
  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminFromDB,
  getMeFromDB,
  changeStatusIntoDB,
};
