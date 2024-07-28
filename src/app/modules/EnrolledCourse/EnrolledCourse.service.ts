/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppErrors';
import { OfferedCourse } from '../offeredCourse/OfferedCourse.model';
import { TEnrolledCourse } from './EnrolledCourse.interface';
import { Student } from '../student/student.model';
import EnrolledCourse from './EnrolledCourse.module';
import mongoose from 'mongoose';
import { SemesterRegistation } from '../semisterRegistration/semisterRegistration.module';
import { Course } from '../course/course.model';
import Faculty from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './EnrolledCourse.utils';

const createCourseIntoDB = async (
  userId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const isOfferedCourseExixts = await OfferedCourse.findById(
    payload.offeredCourse,
  );
  const course = await Course.findById(isOfferedCourseExixts?.course);

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

  const enrolledCourse = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExixts.semesterRegistration,
        student: studentId._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: { _id: 0, totalEnrolledCredits: 1 },
    },
  ]);
  // check total enrolled credit + new enrolled course credit > maxCreadit
  const totalCredits =
    enrolledCourse.length > 0 ? enrolledCourse[0].totalEnrolledCredits : 0;

  if (
    totalCredits &&
    semesterRegistration?.maxCredit &&
    totalCredits + course?.credits > semesterRegistration?.maxCredit
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have exceeded maximum number of credits !',
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const enrolledCourseData = {
      semesterRegistration: isOfferedCourseExixts.semesterRegistration,
      academicSemester: isOfferedCourseExixts.academicSemester,
      academicFaculty: isOfferedCourseExixts.academicFaculty,
      academicDepartment: isOfferedCourseExixts.academicDepartment,
      offeredCourse: payload.offeredCourse,
      course: isOfferedCourseExixts.course,
      student: studentId,
      faculty: isOfferedCourseExixts.faculty,
      isEnrolled: true,
      // courseMarks: '',
      // grade: '',
      // gradePoints: '',
      // isCompleted: '',
    };

    const result = await EnrolledCourse.create([enrolledCourseData], {
      session,
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to enrolled this course',
      );
    }
    const maxCapacity = isOfferedCourseExixts.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(
      payload.offeredCourse, // offeredCourse  Id
      { maxCapacity: maxCapacity - 1 },
      { new: true, session },
    );

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateEnrolledCourseMarksIntoDB = async (
  id: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterExixts =
    await SemesterRegistation.findById(semesterRegistration);
  if (!isSemesterExixts) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registation Not Found');
  }

  const isOfferedCourseExixts = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExixts) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course Not Found');
  }

  const isStudentExixts = await Student.findById(student);
  if (!isStudentExixts) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student Not Found');
  }

  const facultyId = await Faculty.findOne({ id }, { _id: 1 });
  if (!facultyId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty Not Found');
  }

  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: facultyId._id,
  });

  if (!isCourseBelongToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'You Aer Forbidden');
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(finalTerm * 0.5);

    const res = await calculateGradeAndPoints(totalMarks);
    modifiedData.grade = res.grade;
    modifiedData.gradePoints = res.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    { new: true },
  );

  return result;
};

export const CoursesService = {
  createCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
