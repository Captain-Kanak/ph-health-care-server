import status from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { UpdateAdmin } from "./admin.interface";
import { Admin, User, UserRole } from "@prisma/client";

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
  user: User,
): Promise<Admin> => {
  try {
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;

    const admin = await prisma.admin.findUnique({ where: { id } });

    if (!admin) {
      throw new AppError("Admin not found", status.NOT_FOUND);
    }

    if (!isSuperAdmin && user.id !== admin.userId) {
      throw new AppError(
        "You are not authorized to update this admin",
        status.FORBIDDEN,
      );
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

const deleteAdminById = async (id: string, user: User): Promise<Admin> => {
  try {
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;

    const admin = await prisma.admin.findUnique({ where: { id } });

    if (!admin) {
      throw new AppError("Admin not found", status.NOT_FOUND);
    }

    if (user.id === admin.userId) {
      throw new AppError(
        "You cannot delete your own admin account",
        status.FORBIDDEN,
      );
    }

    const result = await prisma.$transaction(async (trx) => {
      const deletedAdmin = await trx.admin.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      await trx.user.update({
        where: { id: admin.userId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      await trx.session.deleteMany({ where: { userId: admin.userId } });

      return deletedAdmin;
    });

    return result;
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
