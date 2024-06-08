import { z } from 'zod';
import { SemesterRejStatus } from './semesterRefistation.constent';

const semesterRegistationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: z
      .enum([...SemesterRejStatus] as [string, ...string[]])
      .default('UPCOMMING'),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    minCredit: z.number().default(3),
    maxCredit: z.number().default(15),
  }),
});

const updateSemesterRegistationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z
      .enum([...SemesterRejStatus] as [string, ...string[]])
      .default('UPCOMMING')
      .optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    minCredit: z.number().default(3).optional(),
    maxCredit: z.number().default(15).optional(),
  }),
});

export const semesterRegistationValidation = {
  semesterRegistationValidationSchema,
  updateSemesterRegistationValidationSchema,
};
