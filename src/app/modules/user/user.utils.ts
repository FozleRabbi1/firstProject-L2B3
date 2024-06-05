// import { TAcademicSemester } from '../academicSemister/academicSemester.interface';
// import { User } from './user.model';

// const findLastStudenId = async () => {
//   const lastStudent = await User.findOne(
//     {
//       role: 'student',
//     },
//     { id: 1, _id: 0 },
//   )
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
// };

// export const generateStudentId = async (payload: TAcademicSemester) => {
//   const currentId = (await findLastStudenId()) || (0).toString();
//   let incrementId = (parseFloat(currentId) + 1).toString().padStart(4, '0');
//   incrementId = `${payload.year}${payload.code}${incrementId}`;
//   return incrementId;
// };

import { TAcademicSemester } from '../academicSemister/academicSemester.interface';
import { User } from './user.model';

const findLastStudenId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    { id: 1, _id: 0 },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};
export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString();
  const lastStudentId = await findLastStudenId();
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
  const currentSemesterCode = payload.code;
  const currentSemesterYear = payload.year;
  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentSemesterYear === currentSemesterYear
  ) {
    currentId = lastStudentId.substring(6);
  }
  let incrementId = (parseFloat(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

// ==================================>>>>>>>>> Find Faculty
const lastFaculty = async () => {
  const laseFaculty = await User.findOne({ role: 'faculty' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();
  return laseFaculty?.id ? laseFaculty?.id.substring(2) : undefined;
};
export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const laseFacultyId = await lastFaculty();
  if (laseFacultyId) {
    currentId = laseFacultyId;
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `F-${incrementId}`;
  return incrementId;
};

// =================================>>>>>>>>> Find Admin
const lastAdmin = async () => {
  const lastAdmin = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastAdmin?.id ? lastAdmin?.id.substring(2) : undefined;
};
export const generatedAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await lastAdmin();
  if (lastAdminId) {
    currentId = lastAdminId;
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `A-${incrementId}`;
  return incrementId;
};
