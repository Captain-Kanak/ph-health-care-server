import { Speciality } from "@prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import status from "http-status";
import { MetaData } from "../../../types/metadata.type";

const createSpeciality = async (payload: Speciality): Promise<Speciality> => {
  try {
    const createdSpeciality = await prisma.speciality.create({ data: payload });

    return createdSpeciality;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to create speciality",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const getSpecialities = async (): Promise<{
  specialities: Speciality[];
  meta: MetaData;
}> => {
  try {
    const specialities = await prisma.speciality.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalSpecialities = await prisma.speciality.count();

    return {
      specialities,
      meta: {
        total: totalSpecialities,
      },
    };
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to fetch specialities",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const getSpecialityById = async (id: string): Promise<Speciality> => {
  try {
    const speciality = await prisma.speciality.findUnique({ where: { id } });

    if (!speciality) {
      throw new AppError("Speciality not found", status.NOT_FOUND);
    }

    return speciality;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Failed to update speciality",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const updateSpeciality = async (
  id: string,
  payload: Speciality,
): Promise<Speciality> => {
  try {
    const speciality = await prisma.speciality.findUnique({ where: { id } });

    if (!speciality) {
      throw new AppError("Speciality not found", status.NOT_FOUND);
    }

    const updatedSpeciality = await prisma.speciality.update({
      where: { id },
      data: payload,
    });

    return updatedSpeciality;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Failed to update speciality",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const deleteSpeciality = async (id: string): Promise<Speciality> => {
  try {
    const speciality = await prisma.speciality.findUnique({ where: { id } });

    if (!speciality) {
      throw new AppError("Speciality not found", status.NOT_FOUND);
    }

    const deletedSpeciality = await prisma.speciality.delete({ where: { id } });

    return deletedSpeciality;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Failed to delete speciality",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const SpecialityService = {
  createSpeciality,
  getSpecialities,
  getSpecialityById,
  updateSpeciality,
  deleteSpeciality,
};
