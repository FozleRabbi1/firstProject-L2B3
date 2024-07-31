import { Schema, model } from 'mongoose';
import { TAdmin } from './admin.interface';
import { bloodGroupEnum, genderEnum } from './admin.constructor';

const UserNameSchema = new Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

const AdminSchema = new Schema<TAdmin>(
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
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

AdminSchema.pre('find', function () {
  this.find({ isDeleted: { $ne: true } });
});
AdminSchema.pre('findOne', function () {
  this.find({ isDeleted: { $ne: true } });
});
AdminSchema.pre('findOneAndUpdate', async function () {
  const id = this.getQuery();
  const isDeleted = await Admin.findOne(id);
  if (!isDeleted) {
    throw new Error('this user already deleted');
  }
  this.find({ isDeleted: { $ne: true } });
});

export const Admin = model<TAdmin>('Admin', AdminSchema);
