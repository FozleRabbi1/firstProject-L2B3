import { Schema, model } from 'mongoose';
import { Guardian, LocalGuardian, Student, UserName } from './studen.interface';

const studentNameSchema = new Schema<UserName>({
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

const studentGuardianSchema = new Schema<Guardian>({
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

const localGuardianSchema = new Schema<LocalGuardian>({
  name: { type: String, required: [true, 'Local guardian name is required'] },
  occupation: { type: String, required: [true, 'occupation is required'] },
  contactNo: { type: String, required: [true, 'contactNo is required'] },
  address: { type: String, required: [true, 'address is required'] },
});

const studentSchema = new Schema<Student>({
  id: { type: String, required: [true, 'Id is required'], unique: true },
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
});

export const StudentModel = model<Student>('Student', studentSchema);
