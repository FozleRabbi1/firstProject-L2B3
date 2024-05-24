export type TUser = {
  id: string;
  password: string;
  role: 'admin' | 'student' | 'faculty';
  needPasswordChange: boolean;
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};
