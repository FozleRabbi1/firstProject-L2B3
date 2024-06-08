import { Schema, model } from 'mongoose';
import { TSemesterRegistation } from './semisterRegistration.interface';
import { SemesterRejStatus } from './semesterRefistation.constent';

const semesterRegistationSchema = new Schema<TSemesterRegistation>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'AcedemicSemester',
    },
    status: { type: String, enum: SemesterRejStatus, default: 'UPCOMMING' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    minCredit: { type: Number, required: true, default: 3 },
    maxCredit: { type: Number, required: true, default: 15 },
  },
  { timestamps: true },
);

export const SemesterRegistation = model<TSemesterRegistation>(
  'SemesterRegistation',
  semesterRegistationSchema,
);
