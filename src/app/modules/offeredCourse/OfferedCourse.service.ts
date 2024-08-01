/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppErrors';
import { SemesterRegistation } from '../semisterRegistration/semisterRegistration.module';
import { TOfferedCourse } from './OfferedCourse.interface';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import Faculty from '../faculty/faculty.model';
import { OfferedCourse } from './OfferedCourse.model';
import { hasTimeConflict } from './OfferedCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';
import mongoose from 'mongoose';
import { Student } from '../student/student.model';

const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
  const offeredQuery = new QueryBuilder(OfferedCourse.find(), query)
    .sort()
    .paginate()
    .filter()
    .fields();

  const result = await offeredQuery.modelQuery;
  const meta = await offeredQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getMyOfferedCourseFromDB = async (userId: string) => {
  const student = await Student.findOne({ id: userId });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'user Not Found');
  }

  const currentOngoingRegistrationSemester = await SemesterRegistation.findOne({
    status: 'ONGOING',
  });

  if (!currentOngoingRegistrationSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'There is no ONGOING semester registration! ',
    );
  }

  const result = await OfferedCourse.aggregate([
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester?._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingRegistrationSemester:
            currentOngoingRegistrationSemester?._id,
          currentStudent: student?._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOngoingRegistrationSemester',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'], //variable থতেকে access করার জন্য && use kora hoyeche
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    // {
    //   $addFields: {
    //     $in: ['course._id', {
    //       $map:
    //     }],
    //   },
    // },
  ]);

  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  return result;
};

const createOfferedCourseFromDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
  } = payload;

  const isSemesterRegistation =
    await SemesterRegistation.findById(semesterRegistration);
  if (!isSemesterRegistation) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registation not found');
  }
  const academicSemester = isSemesterRegistation?.academicSemester;

  const isAcademicFaculty = await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found');
  }

  const isAcademicDepartment =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found');
  }

  const isCourse = await Course.findById(course);
  if (!isCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const isfaculty = await Faculty.findById(faculty);
  if (!isfaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
  }

  // check if the department is belong to the faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });
  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ` This ...${isAcademicDepartment?.name}... is not exists in ...${isAcademicFaculty.name}... `,
    );
  }

  // check if the same course same section in same registered semester exists
  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });
  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      ` this offered course with section is already exist! `,
    );
  }

  // get the schedules of the faculties  ( একজোন faculties at a time এক এর অধিক class নিতে পারবে না )
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `This faculty is not available at that time ! choose another day or time `,
    );
  }
  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

// ========================================>>>>>>>>>>>> updateCourseIntoDB
const updateCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  // check offered course  exists or not
  const isOfferdCourseExisis = await OfferedCourse.findById(id);
  if (!isOfferdCourseExisis) {
    throw new AppError(httpStatus.NOT_FOUND, `Offered Course is not found`);
  }

  // check faculty exists or not
  const isFacultyExists = await Faculty.findById(payload?.faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, `Faculty not found`);
  }

  const semesterRegistation = isOfferdCourseExisis.semesterRegistation;
  // check this semester registered "UPCOMMING" or not
  const isUpcomming = await SemesterRegistation.findById(semesterRegistation);
  if (isUpcomming?.status !== 'UPCOMMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `this semester is already ${isUpcomming?.status}`,
    );
  }
  // get the schedules of the faculties  ( একজোন faculties at a time এক এর অধিক class নিতে পারবে না )
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistation,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `This faculty is not available at that time ! choose another day or time `,
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  const isOfferdCourseExisis = await OfferedCourse.findById(id);
  if (!isOfferdCourseExisis) {
    throw new AppError(httpStatus.NOT_FOUND, 'Deleted course is Not Found');
  }

  const semesterRegistation = isOfferdCourseExisis.semesterRegistration;
  const semesterRegistationStatus =
    await SemesterRegistation.findById(semesterRegistation).select('status');

  if (semesterRegistationStatus?.status !== 'UPCOMMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered Course Can not be Deleted ! Because it is ${semesterRegistationStatus?.status}`,
    );
  }

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    const result = await OfferedCourse.findByIdAndDelete(id, {
      new: true,
      session,
    });

    await SemesterRegistation.findByIdAndDelete(semesterRegistation, {
      new: true,
      session,
    });
    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const OfferedCourseService = {
  getAllOfferedCourseFromDB,
  getMyOfferedCourseFromDB,
  createOfferedCourseFromDB,
  updateCourseIntoDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
};
