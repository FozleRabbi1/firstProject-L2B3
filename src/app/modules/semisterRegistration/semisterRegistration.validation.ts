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

export const semesterRegistationValidation = {
  semesterRegistationValidationSchema,
};
