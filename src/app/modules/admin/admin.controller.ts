import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AdminService } from "./admin.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdmins();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admins fetched successfully",
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
};
