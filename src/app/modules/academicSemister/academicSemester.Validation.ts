import { z } from 'zod';
import {
  Months,
  SemesterName,
  Semestercode,
} from './academicSemester.constant';
// এই Months, SemesterName, Semestercode var তিনটি academicSemester.constant.ts file থেকে এসেছে
const months = z.enum([...Months] as [string, ...string[]]);
const semesterName = z.enum([...SemesterName] as [string, ...string[]]);
const semesterCode = z.enum([...Semestercode] as [string, ...string[]]);

const CreateAcademicSemesterSchemaValidation = z.object({
  body: z.object({
    name: semesterName,
    code: semesterCode,
    year: z.string(),
    startMonth: months,
    endMonth: months,
  }),
});
const UpdateAcademicSemesterSchemaValidation = z.object({
  body: z.object({
    name: semesterName.optional(),
    code: semesterCode.optional(),
    year: z.string().optional(),
    startMonth: months.optional(),
    endMonth: months.optional(),
  }),
});

export const validateAcademicSemester = {
  CreateAcademicSemesterSchemaValidation,
  UpdateAcademicSemesterSchemaValidation,
};
