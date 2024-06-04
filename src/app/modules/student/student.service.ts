// import { TStudent } from './studen.interface';
import mongoose from 'mongoose';
import { Student } from './student.model';
import { AppError } from '../../errors/AppErrors';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './studen.interface';

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

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  const queryObj = { ...query }; // copy query
  let searchTerm = '';
  if (query?.searchTerm) {
    searchTerm = query.searchTerm as string;
  }
  const studentSearchableField = ['email', 'name.firstName', 'presentAddress'];

  const searchQuery = Student.find({
    $or: studentSearchableField.map((filed) => ({
      [filed]: { $regex: searchTerm, $options: 'i' },
    })),
  });
  const excluedeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  excluedeFields.forEach((el) => delete queryObj[el]); //======== এখানে email কে বের করে আনা হয়েছে

  console.log({ query }, { queryObj });
  const filterQuery = searchQuery
    .find(queryObj) //=== email এর সাহায্যে exact match করে fined করা ,,
    .populate([
      { path: 'academicDepartment', populate: { path: 'academicFaculty' } },
      { path: 'admissionSemester' },
    ]);

  let sort = '-createdAt';
  if (query.sort) {
    sort = query.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);
  let page = 1;
  let limit = 0;
  let skip = 0;
  if (query.limit) {
    limit = Number(query.limit);
  }
  if (query.page) {
    page = Number(query.page);
    skip = (page - 1) * limit;
  }
  const paginateQuery = sortQuery.skip(skip);
  const limitQuery = paginateQuery.limit(limit);

  let fields = '-__v';
  if (query.fields) {
    fields = (query.fields as string).split(',').join(' ');
  }
  const fieldsFiltering = await limitQuery.select(fields);

  return fieldsFiltering;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id }).populate([
    { path: 'academicDepartment', populate: { path: 'academicFaculty' } },
    { path: 'admissionSemester' },
  ]);
  return result;
};

const updatedStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localguardian, ...remaningStudentData } = payload;

  // ============Non-Primitive data UPDATE Logic
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remaningStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localguardian && Object.keys(localguardian).length) {
    for (const [key, value] of Object.entries(localguardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
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
    throw new Error('Failed to delete Student');
  }
};

export const StudentServices = {
  // createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updatedStudentIntoDB,
  DeleteSingleStudentFromDB,
};
