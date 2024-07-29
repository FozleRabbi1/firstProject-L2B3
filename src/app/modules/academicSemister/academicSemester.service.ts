import QueryBuilder from '../../builder/QueryBuilder';
import { AppError } from '../../errors/AppErrors';
import {
  academicSemesterNameCodeMapper,
  AcademicSemesterSearchableFields,
} from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  }
  const result = await AcademicSemester.create(payload);
  return result;
};

// const getAllAcademicSemesterFromDB = async () => {
//   const result = await AcademicSemester.find();
//   return result;
// };
const getAllAcademicSemesterFromDB = async (query: Record<string, unknown>) => {
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
    .search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicSemesterQuery.modelQuery;
  const meta = await academicSemesterQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

// const updateSingleSemesterFromDB = async (
//   id: string,
//   payload: TAcademicSemester,
// ) => {
//   if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
//     throw new Error('Invalid Semester Code');
//   }
//   const result = await AcademicSemester.findByIdAndUpdate(id, payload, {
//     new: true,
//   });
//   return result;
// };

const updateSingleSemesterFromDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(502, 'Invalid Semester Code');
  }
  const result = await AcademicSemester.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const academicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleSemesterFromDB,
  updateSingleSemesterFromDB,
};
