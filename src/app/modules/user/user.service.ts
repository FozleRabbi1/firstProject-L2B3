import config from '../../config';
import { TStudent } from '../student/studen.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create a object
  const userData: Partial<TUser> = {};
  // if password is not given , use default password
  userData.password = password || (config.default_password as string);
  // set student role
  userData.role = 'student';
  // set manually generated id
  userData.id = '203010001';
  // create a userData
  const newUser = await User.create(userData);
  if (Object.keys(newUser).length) {
    studentData.id = newUser.id; // this is mebedding Id
    studentData.user = newUser._id; // this is reference Id

    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
