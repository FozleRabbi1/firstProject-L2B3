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
    year: z.date(),
    startMonth: months,
    endMonth: months,
  }),
});

export const validateAcademicSemester = {
  CreateAcademicSemesterSchemaValidation,
};
