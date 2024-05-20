import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import {
  StudentModel,
  // StudentMethods,
  // StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './studen.interface';
import config from '../../config';

const studentNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [10, 'name can not be more then 10 character'],
  },
  middleName: { type: String, trim: true },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last name is required'],
  },
});

const studentGuardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    trim: true,
    required: [true, 'fatherName is required'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'fatherOcupation is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'fatherContactNo is required'],
  },
  motherName: { type: String, required: [true, 'motherName is required'] },
  motherOccupation: {
    type: String,
    required: [true, 'motherOcupation is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'motherContactNo is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: [true, 'Local guardian name is required'] },
  occupation: { type: String, required: [true, 'occupation is required'] },
  contactNo: { type: String, required: [true, 'contactNo is required'] },
  address: { type: String, required: [true, 'address is required'] },
});

// const studentSchema = new Schema<TStudent, StudentModel, StudentMethods>({
const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, required: [true, 'Id is required'], unique: true },
  password: {
    type: String,
    required: [true, 'password is required'],
    maxlength: [10, 'password can not be more then 10 characters'],
    minlength: [5, 'password can not be less then 5 characters'],
  },
  name: {
    type: studentNameSchema,
    required: [true, 'eta to mamar barir abdar na, je tumi nam diba na'],
  },
  gender: {
    type: String,
    enum: {
      values: ['female', 'male', 'other'],
      message: `{VALUE} is not valid`,
      // message:
      //   "the gender can only be one of the following : 'female', 'male', 'other'",
    },
    required: true,
  },
  email: { type: String, required: [true, 'email is required'] },
  contactNumber: {
    type: String,
    required: [true, 'contactNumber is required'],
  },
  emergencyContactNo: {
    type: String,
    required: [true, 'emergencyContactNo is required'],
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'],
      message:
        "The blood group can only be one of the following : 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'",
    },
  },
  presentAddress: {
    type: String,
    required: [true, 'Present Address is required '],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent Address is required '],
  },
  guardian: {
    type: studentGuardianSchema,
    required: [true, 'student Guardian is required'],
  },
  localguardian: {
    type: localGuardianSchema,
    required: [true, 'local Guardian is required'],
  },
  profileImg: { type: String },
  isActive: { type: String, enum: ['active', 'block'], default: 'active' },
  isDeleted: { type: Boolean, default: false },
});

// // // //======================>>>>>>>>>> document middleware hook
// pre save middleware / hook    // এই function টি save function / create function এর কাজের সময় কাজ করবে
// studentSchema.pre('save', async function (next) {
//   // eslint-disable-next-line @typescript-eslint/no-this-alias
//   const user = this;
//   user.password = await bcrypt.hash(
//     user.password,
//     Number(config.bcrypt_salt_round),
//   );
//   next();
// });

// post save middleware / hook  // এই function টি save function / create function এর কাজের সময় কাজ করবে
studentSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});
// studentSchema.set('toJSON', {
//   transform: (doc, ret) => {
//     delete ret.password;
//     return ret;
//   },
// });

// ====================>>>>>>> Query Middleware
studentSchema.pre('find', function (next) {
  // console.log(this);
  next();
});

// ============================>>>>>>>>>>> creating a custome instance method
// studentSchema.methods.isUserExits = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
