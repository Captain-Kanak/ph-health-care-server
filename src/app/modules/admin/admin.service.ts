import status from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { UpdateAdmin } from "./admin.interface";
import { Admin } from "@prisma/client";

const getAllAdmins = async (): Promise<Admin[]> => {
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

const getAdminById = async (id: string): Promise<Admin> => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id } });

    if (!admin) {
      throw new AppError("Admin not found", status.NOT_FOUND);
    }

    return admin;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Failed to get admin",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const updateAdminById = async (
  id: string,
  payload: UpdateAdmin,
): Promise<Admin> => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id } });

    if (!admin) {
      throw new AppError("Admin not found", status.NOT_FOUND);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: payload,
    });

    return updatedAdmin;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Failed to update admin",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const deleteAdminById = async (id: string): Promise<Admin> => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id } });

    if (!admin) {
      throw new AppError("Admin not found", status.NOT_FOUND);
    }

    const deletedAdmin = await prisma.admin.delete({ where: { id } });

    return deletedAdmin;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Failed to delete admin",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
};
