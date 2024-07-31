import config from '../config';
import { User_Role } from '../modules/user/user.constent';
import { User } from '../modules/user/user.model';

const superUser = {
  id: '0001',
  email: 'fozlerabbishuvo@gmail.com',
  password: config.super_admin_password,
  role: User_Role.superAdmin,
  needPasswordChange: false,
  status: 'in-progress',
  isDeleted: false,
};

export const seedSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({ role: User_Role.superAdmin });
  if (!isSuperAdminExists) {
    await User.create(superUser);
  }
};
