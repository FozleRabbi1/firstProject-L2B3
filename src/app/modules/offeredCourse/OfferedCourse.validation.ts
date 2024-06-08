import { z } from 'zod';
import { Days } from './OfferedCourse.constent';

const offeredCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistation: z.string(),
    academicSemester: z.string().optional(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    maxCapacity: z.number().int().positive(),
    section: z.number().int().positive(),
    days: z.array(z.enum([...Days] as [string, ...string[]])),
    startTime: z.string(),
    endTime: z.string(),
  }),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().int().positive().optional(),
    days: z.array(z.enum([...Days] as [string, ...string[]])).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }),
});

export const OfferedCOurseValidationSchema = {
  offeredCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
