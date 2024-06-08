import httpStatus from 'http-status';
import { AppError } from '../../errors/AppErrors';
import { SemesterRegistation } from '../semisterRegistration/semisterRegistration.module';
import { TOfferedCourse } from './OfferedCourse.interface';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import Faculty from '../faculty/faculty.model';
import { OfferedCourse } from './OfferedCourse.model';

const createOfferedCourseFromDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistation,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = payload;

  const isSemesterRegistation =
    await SemesterRegistation.findById(semesterRegistation);
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

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

export const OfferedCourseService = {
  createOfferedCourseFromDB,
};
