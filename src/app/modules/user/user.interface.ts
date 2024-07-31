/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { User_Role } from './user.constent';

export interface TUser {
  id: string;
  email: string;
  password: string;
  passwordChangeAt?: Date;
  role: 'super-admin' | 'admin' | 'student' | 'faculty';
  needPasswordChange: boolean;
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  // instance method for checking if the user exist
  isUserExistsByCustomeId(id: string): Promise<TUser>;
  // instance method for checking if the password are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
  // instance method for checking when password wad changed
  isJWTIssuedBeforePasswordChange(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof User_Role;
