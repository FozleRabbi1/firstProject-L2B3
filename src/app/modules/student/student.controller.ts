/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StudentServices } from './student.service';

const getAllStudents = async (req: Request, res: Response) => {
  const result = await StudentServices.getAllStudentFromDB();
  try {
    res.status(200).json({
      success: true,
      message: 'students are retrived successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'somthing went wrong',
      data: err,
    });
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'student is retrived successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'somthing went wrong',
      data: err,
    });
  }
};

const deleteSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.DeleteSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'student deleted successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'somthing went wrong',
      data: err,
    });
  }
};

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
};
