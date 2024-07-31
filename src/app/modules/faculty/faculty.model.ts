import { Schema, model } from 'mongoose';
import { TFaculty } from './faculty.interface';
import { AppError } from '../../errors/AppErrors';
import httpStatus from 'http-status';

const genderEnum = ['male', 'female', 'other'];
const bloodGroupEnum = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const UserNameSchema = new Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

const FacultySchema = new Schema<TFaculty>(
  {
    id: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    designation: { type: String, required: true },
    name: { type: UserNameSchema, required: true },
    gender: { type: String, enum: genderEnum, required: true },
    dateOfBirth: { type: String },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: {
        values: bloodGroupEnum,
        message:
          "The blood group can only be one of the following : 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'",
      },
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    profileImg: { type: String, default: '' },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// এই কাজ টি .service এর মধ্যে করা হয়েছে , এখানে করলে deleteSingleFacultyData function এর মধ্যে problem হয়
// FacultySchema.pre('find', function () {
//   this.find({ isDeleted: { $ne: true } });
// });

FacultySchema.pre('findOne', function () {
  this.find({ isDeleted: { $ne: true } });
});

FacultySchema.pre('findOneAndUpdate', async function (next) {
  const id = this.getQuery();
  const isFacultuExists = await Faculty.findOne(id);
  if (!isFacultuExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty Not Found');
  }
  next();
});

// Create the model
const Faculty = model<TFaculty>('Faculty', FacultySchema);

export default Faculty;
