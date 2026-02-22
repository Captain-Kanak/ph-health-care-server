import { NextFunction, Request, Response } from "express";
import { SpecialityService } from "./speciality.service";
import catchAsync from "../../shared/catchAsync";

const createSpeciality = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await SpecialityService.createSpeciality(payload);

  return res.status(201).json({
    success: true,
    message: "Speciality created successfully",
    data: result,
  });
});

const getSpecialities = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialityService.getSpecialities();

  return res.status(200).json({
    success: true,
    message: "Specialities fetched successfully",
    data: result,
  });
});

const updateSpeciality = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await SpecialityService.updateSpeciality(
    id as string,
    payload,
  );

  return res.status(200).json({
    success: true,
    message: "Speciality updated successfully",
    data: result,
  });
});

const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SpecialityService.deleteSpeciality(id as string);

  return res.status(200).json({
    success: true,
    message: "Speciality deleted successfully",
    data: result,
  });
});

export const SpecialityController = {
  createSpeciality,
  getSpecialities,
  updateSpeciality,
  deleteSpeciality,
};
