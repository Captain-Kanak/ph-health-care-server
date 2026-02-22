import { Speciality } from "@prisma/client";
import { AppError } from "../../utils/AppError";
import { prisma } from "../../lib/prisma";

interface MetaData {
  total: number;
}

const createSpeciality = async (payload: Speciality): Promise<Speciality> => {
  try {
    const speciality = await prisma.speciality.create({ data: payload });

    return speciality;
  } catch (error) {
    console.error(error);

    throw new AppError("Error creating speciality", 500);
  }
};

const getSpecialities = async (): Promise<{
  specialities: Speciality[];
  meta: MetaData;
}> => {
  try {
    const specialities = await prisma.speciality.findMany();

    const total = await prisma.speciality.count();

    return {
      specialities,
      meta: {
        total,
      },
    };
  } catch (error) {
    console.error(error);

    throw new AppError("Error getting specialities", 500);
  }
};

const updateSpeciality = async (
  id: string,
  payload: Speciality,
): Promise<Speciality> => {
  try {
    const speciality = await prisma.speciality.findUnique({ where: { id } });

    if (!speciality) {
      throw new AppError("Speciality not found", 404);
    }

    const updatedSpeciality = await prisma.speciality.update({
      where: { id },
      data: payload,
    });

    return updatedSpeciality;
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Error updating speciality", 500);
  }
};

const deleteSpeciality = async (id: string): Promise<Speciality> => {
  try {
    const speciality = await prisma.speciality.findUnique({ where: { id } });

    if (!speciality) {
      throw new AppError("Speciality not found", 404);
    }

    const deletedSpeciality = await prisma.speciality.delete({ where: { id } });

    return deletedSpeciality;
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Error deleting speciality", 500);
  }
};

export const SpecialityService = {
  createSpeciality,
  getSpecialities,
  updateSpeciality,
  deleteSpeciality,
};
