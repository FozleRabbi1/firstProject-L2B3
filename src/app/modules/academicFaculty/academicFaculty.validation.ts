import { z } from 'zod';

const academicFacultyValidationSchema = z.object({
  name: z.string({
    invalid_type_error: 'Academic Faculty Must Be String',
  }),
});

const updateAcademicFacultyValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Academic Faculty Must Be String',
    })
    .optional(),
});

export const academicFacultyValidation = {
  academicFacultyValidationSchema,
  updateAcademicFacultyValidationSchema,
};
