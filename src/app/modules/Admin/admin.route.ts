import express from 'express';
import { AdminControllers } from './admin.controller';
import { adminCreateValidationSchema } from './admin.validation';
import { validateRequest } from '../../middleware/validateRequest';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmins);

router.get('/:id', AdminControllers.getSingleAdmin);

router.patch(
  '/:id',
  validateRequest(
    adminCreateValidationSchema.updateAdminCreateValidationSchema,
  ),
  AdminControllers.updateAdmin,
);

router.delete('/:adminId', AdminControllers.deleteAdmin);

export const AdminRoutes = router;
