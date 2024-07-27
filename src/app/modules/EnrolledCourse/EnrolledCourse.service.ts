/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppErrors';
import { OfferedCourse } from '../offeredCourse/OfferedCourse.model';
import { TEnrolledCourse } from './EnrolledCourse.interface';
import { Student } from '../student/student.model';
import EnrolledCourse from './EnrolledCourse.module';
// import mongoose from 'mongoose';
import { SemesterRegistation } from '../semisterRegistration/semisterRegistration.module';

const createCourseIntoDB = async (
  userId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const isOfferedCourseExixts = await OfferedCourse.findById(
    payload.offeredCourse,
  );

  if (!isOfferedCourseExixts) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course Not Found');
  }
  if (isOfferedCourseExixts.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Room is full !');
  }

  // const studentInfo = await Student.findOne({ id: userId }).select('id');
  const studentId = await Student.findOne({ id: userId }, { _id: 1 }); // field filtering

  if (!studentId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student Not Found');
  }

  const isStudentAlreadyExists = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExixts?.semesterRegistration,
    offeredCourse: payload.offeredCourse,
    // student: studentInfo._id,
    student: studentId,
  });

  if (isStudentAlreadyExists) {
    throw new AppError(httpStatus.CONFLICT, 'You Are ALready Enrolled');
  }

  //check total credites exceeds maxCredit
  const semesterRegistration = await SemesterRegistation.findById(
    isOfferedCourseExixts?.semesterRegistration,
  ).select('maxCredit');

  // check total enrolled credit + new enrolled course credit > maxCreadit
  const enrolledCourse = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExixts.semesterRegistration,
        student: studentId._id,
      },
    },
  ]);
  console.log({ enrolledCourse });

  // const session = await mongoose.startSession();
  // try {
  //   session.startTransaction();

  //   const enrolledCourseData = {
  //     semesterRegistration: isOfferedCourseExixts.semesterRegistration,
  //     academicSemester: isOfferedCourseExixts.academicSemester,
  //     academicFaculty: isOfferedCourseExixts.academicFaculty,
  //     academicDepartment: isOfferedCourseExixts.academicDepartment,
  //     offeredCourse: payload.offeredCourse,
  //     course: isOfferedCourseExixts.course,
  //     student: studentId,
  //     faculty: isOfferedCourseExixts.faculty,
  //     isEnrolled: true,
  //     // courseMarks: '',
  //     // grade: '',
  //     // gradePoints: '',
  //     // isCompleted: '',
  //   };

  //   const result = await EnrolledCourse.create([enrolledCourseData], {
  //     session,
  //   });

  //   if (!result) {
  //     throw new AppError(
  //       httpStatus.BAD_REQUEST,
  //       'Failed to enrolled this course',
  //     );
  //   }
  //   const maxCapacity = isOfferedCourseExixts.maxCapacity;
  //   await OfferedCourse.findByIdAndUpdate(
  //     payload.offeredCourse, // offeredCourse  Id
  //     { maxCapacity: maxCapacity - 1 },
  //     { new: true, session },
  //   );

  //   await session.commitTransaction();
  //   await session.endSession();
  //   return result;
  // } catch (err: any) {
  //   await session.abortTransaction();
  //   await session.endSession();
  //   throw new Error(err);
  // }
};

export const CoursesService = {
  createCourseIntoDB,
};
