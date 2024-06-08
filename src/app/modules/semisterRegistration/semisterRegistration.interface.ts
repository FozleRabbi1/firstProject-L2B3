import { Types } from 'mongoose';

export type TSemesterRegistation = {
  academicSemester: Types.ObjectId;
  status: 'UPCOMMING' | 'ONGOING' | 'ENDED';
  startDate: Date;
  endDate: Date;
  minCredit: number;
  maxCredit: number;
};
