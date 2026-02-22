import { Request, Response } from "express";
import { SpecialityService } from "./speciality.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

const createSpeciality = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await SpecialityService.createSpeciality(payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Speciality created successfully",
    data: result,
  });
});

const getSpecialities = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialityService.getSpecialities();

  sendResponse(res, {
    statusCode: 200,
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

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Speciality updated successfully",
    data: result,
  });
});

const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SpecialityService.deleteSpeciality(id as string);

  sendResponse(res, {
    statusCode: 200,
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
