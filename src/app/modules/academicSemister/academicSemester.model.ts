import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  Months,
  SemesterName,
  Semestercode,
} from './academicSemester.constant';

const ascademicSemesterSchema = new Schema<TAcademicSemester>({
  name: {
    type: String,
    enum: SemesterName,
    required: true,
  },
  code: {
    type: String,
    enum: Semestercode,
    required: true,
  },
  year: {
    type: Date,
    required: true,
  },
  startMonth: {
    type: String,
    enum: Months,
    required: true,
  },
  endMonth: {
    type: String,
    enum: Months,
    required: true,
  },
});

export const AcademicSemester = model<TAcademicSemester>(
  'AcedemicSemester',
  ascademicSemesterSchema,
);
