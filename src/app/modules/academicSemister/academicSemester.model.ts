import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  Months,
  SemesterName,
  Semestercode,
} from './academicSemester.constant';
import { AppError } from '../../errors/AppErrors';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
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
      type: String,
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
  },
  {
    timestamps: true,
  },
);

academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });
  if (isSemesterExists) {
    throw new AppError(409, 'Semester already exists');
  }
  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  'AcedemicSemester',
  academicSemesterSchema,
);
