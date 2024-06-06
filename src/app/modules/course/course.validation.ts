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
  }),
});

export const CourseValidationSchema = {
  courseValidationSchema,
};
