import { Schema, model } from 'mongoose';
import { TOfferedCourse } from './OfferedCourse.interface';

const Days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const offeredCourseSchema = new Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SemesterRegistation',
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicFaculty',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicDepartment',
    },
    course: { type: Schema.Types.ObjectId, required: true, ref: 'Course' },
    faculty: { type: Schema.Types.ObjectId, required: true, ref: 'Faculty' },
    maxCapacity: { type: Number, required: true },
    section: { type: Number, required: true },
    days: [{ type: String, enum: Days, required: true }],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { timestamps: true },
);

export const OfferedCourse = model<TOfferedCourse>(
  'OfferedCourse',
  offeredCourseSchema,
);
