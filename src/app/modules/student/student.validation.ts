import { z } from 'zod';

// Define Zod schemas for individual interfaces
const userCreateValidationNameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(10, 'Name can not be more than 10 characters')
    .min(1, 'First name is required'),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, 'Last name is required'),
});

const guardianCreateValidationSchema = z.object({
  fatherName: z.string().trim().min(1, 'Father name is required'),
  fatherOccupation: z.string().min(1, 'Father occupation is required'),
  fatherContactNo: z.string().min(1, 'Father contact number is required'),
  motherName: z.string().min(1, 'Mother name is required'),
  motherOccupation: z.string().min(1, 'Mother occupation is required'),
  motherContactNo: z.string().min(1, 'Mother contact number is required'),
});

const localGuardianCreateValidationSchema = z.object({
  name: z.string().min(1, 'Local guardian name is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  contactNo: z.string().min(1, 'Contact number is required'),
  address: z.string().min(1, 'Address is required'),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(5, { message: 'password can not be less then 5 characters' })
      .max(10, { message: 'password can not be more than 10 characters' }),
    // id: z.string().min(1, 'ID is required').refine(async (id) => await isIdUnique(id), {
    //     message: 'ID must be unique',     zod এ কি unique use করা যাই না ,,,,
    //   }),
    student: z.object({
      name: userCreateValidationNameSchema,
      gender: z.enum(['female', 'male', 'other'], {
        errorMap: () => ({ message: '{VALUE} is not valid' }),
      }),
      email: z
        .string()
        .email('Invalid email address')
        .min(1, 'Email is required'),
      dethOfBirth: z.string().optional(),
      contactNumber: z.string().min(1, 'Contact number is required'),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency contact number is required'),
      bloodGroup: z
        .enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().min(1, 'Present address is required'),
      permanentAddress: z.string().min(1, 'Permanent address is required'),
      guardian: guardianCreateValidationSchema,
      localguardian: localGuardianCreateValidationSchema,
      academicDepartment: z.string(),
      admissionSemester: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
});

//==================================>>>>>>>>>>>>> Student Update validation schema
const userUpdateValidationNameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(10, 'Name can not be more than 10 characters')
    .min(1, 'First name is required')
    .optional(),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, 'Last name is required').optional(),
});

const guardianUpdateValidationSchema = z.object({
  fatherName: z.string().trim().min(1, 'Father name is required').optional(),
  fatherOccupation: z
    .string()
    .min(1, 'Father occupation is required')
    .optional(),
  fatherContactNo: z
    .string()
    .min(1, 'Father contact number is required')
    .optional(),
  motherName: z.string().min(1, 'Mother name is required').optional(),
  motherOccupation: z
    .string()
    .min(1, 'Mother occupation is required')
    .optional(),
  motherContactNo: z
    .string()
    .min(1, 'Mother contact number is required')
    .optional(),
});

const localGuardianUpdateValidationSchema = z.object({
  name: z.string().min(1, 'Local guardian name is required').optional(),
  occupation: z.string().min(1, 'Occupation is required').optional(),
  contactNo: z.string().min(1, 'Contact number is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
});

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z
      .object({
        name: userUpdateValidationNameSchema.optional(),
        gender: z
          .enum(['female', 'male', 'other'], {
            errorMap: () => ({ message: '{VALUE} is not valid' }),
          })
          .optional(),
        email: z
          .string()
          .email('Invalid email address')
          .min(1, 'Email is required')
          .optional(),
        dethOfBirth: z.string().optional(),
        contactNumber: z
          .string()
          .min(1, 'Contact number is required')
          .optional(),
        emergencyContactNo: z
          .string()
          .min(1, 'Emergency contact number is required')
          .optional(),
        bloodGroup: z
          .enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'])
          .optional(),
        presentAddress: z
          .string()
          .min(1, 'Present address is required')
          .optional(),
        permanentAddress: z
          .string()
          .min(1, 'Permanent address is required')
          .optional(),
        guardian: guardianUpdateValidationSchema.optional(),
        localguardian: localGuardianUpdateValidationSchema.optional(),
        academicDepartment: z.string().optional(),
        admissionSemester: z.string().optional(),
        profileImg: z.string().optional(),
      })
      .optional(),
  }),
});

// Export the Zod validation schema
export const studentValidatiSchema = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
