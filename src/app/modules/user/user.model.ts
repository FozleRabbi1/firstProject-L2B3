import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: 0,
    },
    passwordChangeAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
      required: [true, 'Role is required'],
    },
    needPasswordChange: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// // // //======================>>>>>>>>>> document middleware hook
// pre save middleware / hook    // এই function টি save function / create function এর কাজের সময় কাজ করবে
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// post save middleware / hook  // এই function টি save function / create function এর কাজের সময় কাজ করবে
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsByCustomeId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChange = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  // const passwordChangeTime = new Date(passwordChangedTimestamp).getTime();  // এটি second এ convert করবে
  const passwordChangeTime =
    new Date(passwordChangedTimestamp).getTime() / 1000; // এটি millisecond এ convert করবে

  return passwordChangeTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
