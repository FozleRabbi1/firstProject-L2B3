import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { searchCourseFilds } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import { AppError } from '../../errors/AppErrors';
import httpStatus from 'http-status';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate({ path: 'preRequisiteCourses.course' }),
    query,
  )
    .search(searchCourseFilds)
    .fields()
    .filter()
    .paginate()
    .sort();
  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate({
    path: 'preRequisiteCourses.course',
  });
  return result;
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const updateSingleCourseIntoDB = async (
  id: string,
  payload: Partial<TCourse>,
) => {
  const { preRequisiteCourses, ...courseReminingData } = payload;

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    const updateBaseiCourseData = await Course.findByIdAndUpdate(
      id,
      courseReminingData,
      { new: true, runValidators: true, session },
    );
    if (!updateBaseiCourseData) {
      throw new AppError(httpStatus.BAD_REQUEST, 'faield to update data');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletedPreRequisite = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisite } },
          },
        },
        { new: true, runValidators: true, session },
      );

      if (!deletedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'faield to update data');
      }

      const newPreREquisite = preRequisiteCourses.filter(
        (el) => el.course && !el.isDeleted,
      );

      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreREquisite } },
        },
        { new: true, runValidators: true, session },
      );

      if (!newPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'faield to update data');
      }
      const result = await Course.findById(id).populate(
        'preRequisiteCourses.course',
      );
      return result;
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Faield to update data ');
  }
};

export const CoursesService = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateSingleCourseIntoDB,
};
