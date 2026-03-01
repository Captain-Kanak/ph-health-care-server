import status from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

const getAllAdmins = async () => {
  try {
    const admins = await prisma.admin.findMany();

    return admins;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get admins",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const AdminService = {
  getAllAdmins,
};
