import { z } from 'zod';

// Define Zod schemas for individual interfaces
const userValidationNameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(10, 'Name can not be more than 10 characters')
    .min(1, 'First name is required'),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, 'Last name is required'),
});

const guardianValidationSchema = z.object({
  fatherName: z.string().trim().min(1, 'Father name is required'),
  fatherOccupation: z.string().min(1, 'Father occupation is required'),
  fatherContactNo: z.string().min(1, 'Father contact number is required'),
  motherName: z.string().min(1, 'Mother name is required'),
  motherOccupation: z.string().min(1, 'Mother occupation is required'),
  motherContactNo: z.string().min(1, 'Mother contact number is required'),
});

const localGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local guardian name is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  contactNo: z.string().min(1, 'Contact number is required'),
  address: z.string().min(1, 'Address is required'),
});

// Define Zod schema for the main student schema
const ValidationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  // id: z.string().min(1, 'ID is required').refine(async (id) => await isIdUnique(id), {
  //     message: 'ID must be unique',     zod এ কি unique use করা যাই না ,,,, 
  //   }),
  name: userValidationNameSchema,
  gender: z.enum(['female', 'male', 'other'], {
    errorMap: () => ({ message: '{VALUE} is not valid' }),
  }),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  emergencyContactNo: z.string().min(1, 'Emergency contact number is required'),
  bloodGroup: z
    .enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'])
    .optional(),
  presentAddress: z.string().min(1, 'Present address is required'),
  permanentAddress: z.string().min(1, 'Permanent address is required'),
  guardian: guardianValidationSchema,
  localguardian: localGuardianValidationSchema,
  profileImg: z.string().optional(),
  isActive: z.enum(['active', 'block']).default('active'),
});

// Export the Zod validation schema
export const studentValidatiSchema = ValidationSchema;
