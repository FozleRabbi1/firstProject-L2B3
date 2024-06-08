import httpStatus from 'http-status';
import { AppError } from '../../errors/AppErrors';
import { AcademicSemester } from '../academicSemister/academicSemester.model';
import { TSemesterRegistation } from './semisterRegistration.interface';
import { SemesterRegistation } from './semisterRegistration.module';
import QueryBuilder from '../../builder/QueryBuilder';
import { SemesterStatus } from './semesterRefistation.constent';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistation,
) => {
  const academicSemesterId = payload?.academicSemester;

  //   check if there any 'UPCOMMING' or 'ONGOING' registered or not
  const isThereAnyUpcommingOrOngoingSemester =
    await SemesterRegistation.findOne({
      $or: [
        { status: SemesterStatus.UPCOMMING },
        { status: SemesterStatus.ONGOING },
      ],
    });
  if (isThereAnyUpcommingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already a ${isThereAnyUpcommingOrOngoingSemester?.status} registerd semester`,
    );
  }

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

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistation>,
) => {
  const requestStatus = payload?.status;
  // Check there is semester exists or not
  const isSemesterExists = await SemesterRegistation.findById(id);
  if (!isSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester not found!');
  }
  //   if the registerd semester registation is ended , we will not updated
  const currentRegisteredStatus = isSemesterExists?.status;
  if (currentRegisteredStatus === SemesterStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This Semester is already ${currentRegisteredStatus}`,
    );
  }
  //   UPCOMMING--->---ONGOING--->---ENDED
  if (currentRegisteredStatus === requestStatus) {
    throw new Error(`this semester already in ${currentRegisteredStatus}`);
  }

  //==================>>>>>>  এই condition গুলো course এ আরও সহজ ভাবে দেখান হয়েছে
  if (
    currentRegisteredStatus === SemesterStatus.UPCOMMING &&
    requestStatus === SemesterStatus.ENDED
  ) {
    throw new Error(`You can't directly update UPCOMMING to ENDED `);
  }
  // এই Condition এর অর্থ হল ONGOING আগে থেকেই আছে , কিন্তু requestStatus === ENDED নয়
  if (
    currentRegisteredStatus === SemesterStatus.ONGOING &&
    requestStatus !== SemesterStatus.ENDED
  ) {
    throw new Error(
      `A semester with status ${currentRegisteredStatus} can only be set to 'ENDED'`,
    );
  }

  const result = await SemesterRegistation.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteSemesterRegistrationFromDB = async () => {};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
