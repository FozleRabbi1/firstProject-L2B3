import config from '../../config';
import { AcademicSemester } from '../academicSemister/academicSemester.model';
import { TStudent } from '../student/studen.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a object
  const userData: Partial<TUser> = {};
  // if password is not given , use default password
  userData.password = password || (config.default_password as string);
  // set student role
  userData.role = 'student';

  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );
  if (admissionSemester) {
    // set dynamic generated id
    userData.id = generateStudentId(admissionSemester);
  }
  // create a userData
  const newUser = await User.create(userData);
  if (Object.keys(newUser).length) {
    payload.id = newUser.id; // this is mebedding Id
    payload.user = newUser._id; // this is reference Id

    const newStudent = await Student.create(payload);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
