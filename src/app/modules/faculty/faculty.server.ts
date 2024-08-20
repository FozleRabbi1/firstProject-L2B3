/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { FacultySearchFields } from './faculty.constent';
import { TFaculty } from './faculty.interface';
import Faculty from './faculty.model';
import { AppError } from '../../errors/AppErrors';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

const getAllFacultyFromDB = async (query: Record<string, unknown>) => {
  const searchQuery = new QueryBuilder(
    Faculty.find({ isDeleted: { $ne: true } }),
    query,
  )
    .search(FacultySearchFields)
    .filter()
    .fields()
    .paginate()
    .sort();

  const result = await searchQuery.modelQuery;
  const meta = await searchQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findById(id).populate({
    path: 'academicDepartment',
  });
  return result;
};

const updateSingleFaculty = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remaningFacultyData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remaningFacultyData,
  };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  const result = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  }).populate({ path: 'academicDepartment' });
  return result;
};

const deleteSingleFacultyData = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Faculty');
    }
    const userId = deletedFaculty.user;
    const deleteUser = await User.findOneAndUpdate(
      userId,
      { isDeleted: true },
      { new: true },
    );
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Faculty');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getDeletedFacultiesFromDB = async () => {
  const result = await Faculty.find({ isDeleted: true }).select([
    'isDeleted',
    'name',
  ]);
  return result;
};

export const FacultyService = {
  getAllFacultyFromDB,
  getSingleFacultyFromDB,
  updateSingleFaculty,
  deleteSingleFacultyData,
  getDeletedFacultiesFromDB,
};
