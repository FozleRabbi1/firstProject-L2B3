import { z } from 'zod';

const preRequisiteCoursesSchema = z.object({
  course: z.string().optional(),
  isDeleted: z.boolean().default(false),
});

const courseValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, { message: 'Title is required' }),
    prefix: z.string().trim().min(1, { message: 'Prefix is required' }),
    code: z
      .number()
      .nonnegative({ message: 'Code must be a non-negative number' }),
    credits: z
      .number()
      .nonnegative({ message: 'Credits must be a non-negative number' }),
    preRequisiteCourses: z.array(preRequisiteCoursesSchema).optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

const updatePreRequisiteCoursesSchema = z.object({
  course: z.string().optional(),
  isDeleted: z.boolean().default(false).optional(),
});

const updateCourseValidationSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, { message: 'Title is required' })
        .optional(),
      prefix: z
        .string()
        .trim()
        .min(1, { message: 'Prefix is required' })
        .optional(),
      code: z
        .number()
        .nonnegative({ message: 'Code must be a non-negative number' })
        .optional(),
      credits: z
        .number()
        .nonnegative({ message: 'Credits must be a non-negative number' })
        .optional(),
      preRequisiteCourses: z.array(updatePreRequisiteCoursesSchema).optional(),
      isDeleted: z.boolean().default(false).optional(),
    })
    .optional(),
});

const CourseFacultyValidationSchema = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
});

export const CourseValidationSchema = {
  courseValidationSchema,
  updateCourseValidationSchema,
  CourseFacultyValidationSchema,
};
