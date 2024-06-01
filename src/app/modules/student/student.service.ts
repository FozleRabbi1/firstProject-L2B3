// import { TStudent } from './studen.interface';
import { Student } from './student.model';

// const createStudentIntoDB = async (studentData: TStudent) => {
//   if (await Student.isUserExists(studentData.id)) {
//     throw new Error('User already exists');
//   }
//   const result = await Student.create(studentData); // built in static method

//   // const student = new Student(studentData); // built in instance method
//   // if (await student.isUserExits(studentData.id)) {
//   //   throw new Error('User already exists');
//   // }
//   // const result = await student.save(); // built in instance method
//   //

//   return result;
// };

const getAllStudentFromDB = async () => {
  const result = await Student.find().populate([
    { path: 'academicDepartment', populate: { path: 'academicFaculty' } },
    { path: 'admissionSemester' },
  ]);
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findById(id).populate([
    { path: 'academicDepartment', populate: { path: 'academicFaculty' } },
    { path: 'admissionSemester' },
  ]);
  return result;
};

const DeleteSingleStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  // createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  DeleteSingleStudentFromDB,
};
