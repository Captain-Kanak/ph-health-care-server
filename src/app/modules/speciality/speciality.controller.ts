import { NextFunction, Request, Response } from "express";
import { SpecialityService } from "./speciality.service";

const createSpeciality = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = req.body;

    const result = await SpecialityService.createSpeciality(payload);

    return res.status(201).json({
      success: true,
      message: "Speciality created successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    next(error);
  }
};

const getSpecialities = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await SpecialityService.getSpecialities();

    return res.status(200).json({
      success: true,
      message: "Specialities fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    next(error);
  }
};

const updateSpeciality = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    console.error(error);

    next(error);
  }
};

const deleteSpeciality = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const result = await SpecialityService.deleteSpeciality(id as string);

    return res.status(200).json({
      success: true,
      message: "Speciality deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    next(error);
  }
};

export const SpecialityController = {
  createSpeciality,
  getSpecialities,
  updateSpeciality,
  deleteSpeciality,
};
