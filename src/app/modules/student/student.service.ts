import { TStudent } from './studen.interface';
import { Student } from './student.model';

const createStudentIntoDB = async (studentData: TStudent) => {
  // const result = await Student.create(student); // built in static method

  const student = new Student(studentData); // built in instance method
  
  if (await student.isUserExits(studentData.id)) {
    throw new Error('User already exists');
  }
  //
  const result = await student.save(); // built in instance method
  return result;
};

const getAllStudentFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
};
