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

const FacultyCreateValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
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
      academicDepartment: z.string().optional(),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

const updateUserNameSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .optional(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: 'Last name is required' }).optional(),
});

const updateFacultyCreateValidationSchema = z.object({
  body: z
    .object({
      faculty: z
        .object({
          designation: z
            .string()
            .min(1, { message: 'Designation is required' })
            .optional(),
          name: updateUserNameSchema.optional(),
          gender: z.enum(genderEnum, { message: 'Invalid gender' }).optional(),
          dateOfBirth: z.string().optional(),
          email: z.string().email({ message: 'Invalid email' }).optional(),
          contactNo: z
            .string()
            .min(1, { message: 'Contact number is required' })
            .optional(),
          emergencyContactNo: z
            .string()
            .min(1, { message: 'Emergency contact number is required' })
            .optional(),
          bloodGroup: z.enum(bloodGroupEnum).optional(),
          presentAddress: z
            .string()
            .min(1, { message: 'Present address is required' })
            .optional(),
          permanentAddress: z
            .string()
            .min(1, { message: 'Permanent address is required' })
            .optional(),
          // profileImg: z.string().optional(),
          academicDepartment: z.string().optional(),
          isDeleted: z.boolean().default(false).optional(),
        })
        .optional(),
    })
    .optional(),
});

export const facultyCreateValidationSchema = {
  FacultyCreateValidationSchema,
  updateFacultyCreateValidationSchema,
};
