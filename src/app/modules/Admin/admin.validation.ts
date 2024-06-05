import { z } from 'zod';

const genderEnum = ['male', 'female', 'other'] as const;
const bloodGroupEnum = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
] as const;

const UserNameSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: 'Last name is required' }),
});

const AdminCreateValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      designation: z.string().min(1, { message: 'Designation is required' }),
      name: UserNameSchema,
      gender: z.enum(genderEnum, { message: 'Invalid gender' }),
      dateOfBirth: z.string().optional(),
      email: z.string().email({ message: 'Invalid email' }),
      contactNo: z.string().min(1, { message: 'Contact number is required' }),
      emergencyContactNo: z
        .string()
        .min(1, { message: 'Emergency contact number is required' }),
      bloodGroup: z.enum(bloodGroupEnum).optional(),
      presentAddress: z
        .string()
        .min(1, { message: 'Present address is required' }),
      permanentAddress: z
        .string()
        .min(1, { message: 'Permanent address is required' }),
      profileImg: z.string().optional(),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

export const adminCreateValidationSchema = {
  AdminCreateValidationSchema,
};
