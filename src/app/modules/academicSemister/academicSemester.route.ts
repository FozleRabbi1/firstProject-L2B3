import express from 'express';
import { AcademicSemisterController } from './academicSemester.controller';

const router = express.Router();

router.post(
  '/create-academic-semester',
  AcademicSemisterController.createAcademicSemester,
);

export const AcademicSemisterRouter = router;
