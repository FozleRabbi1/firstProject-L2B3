import { z } from 'zod';
import { Days, timeErrorMessage, timeRegex } from './OfferedCourse.constent';

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
const offeredCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicSemester: z.string().optional(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number().int().positive(),
      section: z.number().int().positive(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: z
        .string() // ph code এর মধ্যে অন্য ভাবে দেয়া আছে , ঐ ভাবে করলেও হবে
        .refine((time) => timeRegex.test(time), { message: timeErrorMessage }),
      endTime: z
        .string()
        .refine((time) => timeRegex.test(time), { message: timeErrorMessage }),
    })
    .refine(
      // ph code এর মধ্যে অন্য ভাবে দেয়া আছে , ঐ ভাবে করলেও হবে
      (data) => timeToMinutes(data.startTime) < timeToMinutes(data.endTime),
      {
        message: 'End time must be after start time',
        path: ['endTime'],
      },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number().int().positive(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: z
        .string() // ph code এর মধ্যে অন্য ভাবে দেয়া আছে , ঐ ভাবে করলেও হবে
        .refine((time) => timeRegex.test(time), { message: timeErrorMessage }),
      endTime: z
        .string()
        .refine((time) => timeRegex.test(time), { message: timeErrorMessage }),
    })
    .refine(
      // ph code এর মধ্যে অন্য ভাবে দেয়া আছে , ঐ ভাবে করলেও হবে
      (data) => timeToMinutes(data.startTime) < timeToMinutes(data.endTime),
      {
        message: 'End time must be after start time',
        path: ['endTime'],
      },
    ),
});

export const OfferedCOurseValidationSchema = {
  offeredCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
