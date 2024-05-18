import { Schema, model } from 'mongoose';
import { Guardian, LocalGuardian, Student, UserName } from './studen.interface';

const studentNameSchema = new Schema<UserName>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

const studentGuardianSchema = new Schema<Guardian>({
  fatherName: { type: String, required: true },
  fatherOcupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOcupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<Student>({
  id: { type: String },
  name: studentNameSchema,
  gender: ['female', 'male', 'other'],
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  bloodGroup: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'],
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  guardian: studentGuardianSchema,
  localguardian: localGuardianSchema,
  profileImg: { type: String },
  isActive: ['active', 'block'],
});

export const StudentModel = model<Student>('Student', studentSchema);
