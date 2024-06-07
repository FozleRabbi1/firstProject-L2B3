import QueryBuilder from '../../builder/QueryBuilder';
import { searchCourseFilds } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';

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

  const updateBaseiCourseData = await Course.findByIdAndUpdate(
    id,
    courseReminingData,
    { new: true, runValidators: true },
  );

  if (preRequisiteCourses && preRequisiteCourses.length > 0) {
    const deletedPreRequisite = preRequisiteCourses
      .filter((el) => el.course && el.isDeleted)
      .map((el) => el.course);

    const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(id, {
      $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisite } } },
    });

    const newPreREquisite = preRequisiteCourses.filter(
      (el) => el.course && !el.isDeleted,
    );

    const newPreRequisiteCourses = await Course.findByIdAndUpdate(id, {
      $addToSet: { preRequisiteCourses: { $each: newPreREquisite } },
    });
  }
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );

  return result;
};

export const CoursesService = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateSingleCourseIntoDB,
};
