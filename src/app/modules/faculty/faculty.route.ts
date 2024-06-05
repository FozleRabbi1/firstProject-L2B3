import express from 'express';
import { FacultyController } from './faculty.controllerl';

const router = express.Router();

router.get('/', FacultyController.getAllFaculty);

export const FacultyRouter = router;
