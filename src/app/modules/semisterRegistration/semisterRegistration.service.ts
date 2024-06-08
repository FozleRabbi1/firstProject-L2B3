import httpStatus from 'http-status';
import { AppError } from '../../errors/AppErrors';
import { AcademicSemester } from '../academicSemister/academicSemester.model';
import { TSemesterRegistation } from './semisterRegistration.interface';
import { SemesterRegistation } from './semisterRegistration.module';
import QueryBuilder from '../../builder/QueryBuilder';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistation,
) => {
  const academicSemesterId = payload?.academicSemester;

  // এখানে check করা হচ্ছে AcademicSemester (dataBase) এর মধ্যে  data আছে কি না ,,, এখানে academicSemesterId ( _id, ObjectId ) হিসেবে আছে
  const isAcademincSemesterExists =
    await AcademicSemester.findById(academicSemesterId);
  if (!isAcademincSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This semester is not exist in dataBase',
    );
  }

  // এখানে check করা হচ্ছে SemesterRegistation এর মধ্যে আগে থেকেই এই data Registard আছে কি না  ,,,এখানে academicSemesterId ( academicSemester ) field হিসেবে আছে
  const isSemesteRegistationExists = await SemesterRegistation.findOne({
    academicSemester: academicSemesterId,
  });
  if (isSemesteRegistationExists) {
    throw new AppError(httpStatus.CONFLICT, 'This Semester Already Exists');
  }

  const result = await SemesterRegistation.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  //   console.log(query);
  const semesterRegistationQuery = new QueryBuilder(
    SemesterRegistation.find().populate({ path: 'academicSemester' }),
    query,
  )
    .fields()
    .filter()
    .paginate()
    .sort();

  const result = await semesterRegistationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result =
    await SemesterRegistation.findById(id).populate('academicSemester');
  return result;
};

const updateSemesterRegistrationIntoDB = async () => {};
const deleteSemesterRegistrationFromDB = async () => {};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
