import { Schema, model, connect } from 'mongoose';

export type Guardian = {
  fatherName: string;
  fatherOcupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOcupation: string;
  motherContactNo: string;
};

export type Name = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type Student = {
  id: string;
  name: Name;
  gender: 'male' | 'female' | 'other';
  email: string;
  dethOfBirth: string;
  contactNumber: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: Guardian;
};
