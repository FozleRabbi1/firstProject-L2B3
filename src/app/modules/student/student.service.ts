// import { TStudent } from './studen.interface';
import mongoose from 'mongoose';
import { Student } from './student.model';
import { AppError } from '../../errors/AppErrors';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

// const createStudentIntoDB = async (studentData: TStudent) => {
//   if (await Student.isUserExists(studentData.id)) {
//     throw new Error('User already exists');
//   }
//   const result = await Student.create(studentData); // built in static method

//   // const student = new Student(studentData); // built in instance method
//   // if (await student.isUserExits(studentData.id)) {
//   //   throw new Error('User already exists');
//   // }
//   // const result = await student.save(); // built in instance method
//   //

//   return result;
// };

const getAllStudentFromDB = async () => {
  const result = await Student.find().populate([
    { path: 'academicDepartment', populate: { path: 'academicFaculty' } },
    { path: 'admissionSemester' },
  ]);
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findById(id).populate([
    { path: 'academicDepartment', populate: { path: 'academicFaculty' } },
    { path: 'admissionSemester' },
  ]);
  return result;
};

const DeleteSingleStudentFromDB = async (id: string) => {
  const isStudentExists = await Student.findOne({ id });
  if (!isStudentExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user not found');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Student');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, ' Failed to delete User ');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const StudentServices = {
  // createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  DeleteSingleStudentFromDB,
};
