import status from "http-status";
import AppError from "../../utils/AppError";
import { prisma } from "../../lib/prisma";
import { UpdateDoctorPayload } from "../../../types/doctor.type";

const getAllDoctors = async () => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        address: true,
        registrationNumber: true,
        experience: true,
        gender: true,
        appointmentFee: true,
        qualification: true,
        currentWorkingPlace: true,
        designation: true,
        isDeleted: true,
        specialities: {
          select: {
            speciality: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return doctors;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to fetch doctors",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const getDoctorById = async (id: string) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        address: true,
        registrationNumber: true,
        experience: true,
        gender: true,
        appointmentFee: true,
        qualification: true,
        currentWorkingPlace: true,
        designation: true,
        specialities: {
          select: {
            speciality: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!doctor) {
      throw new AppError("Doctor not found", status.NOT_FOUND);
    }

    return doctor;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Failed to fetch doctor",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const updateDoctorById = async (id: string, payload: UpdateDoctorPayload) => {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { id } });

    if (!doctor) {
      throw new AppError("Doctor not found", status.NOT_FOUND);
    }

    const { specialities, ...restPayload } = payload;
    const updateData: any = {
      ...restPayload,
    };

    if (specialities) {
      updateData.specialities = {
        set: [],
        connect: specialities.map((specialityId) => ({
          id: specialityId,
        })),
      };
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: updateData,
    });

    return updatedDoctor;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Failed to update doctor",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const deleteDoctorById = async (id: string) => {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { id } });

    if (!doctor) {
      throw new AppError("Doctor not found", status.NOT_FOUND);
    }

    const deletedDoctor = await prisma.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return deletedDoctor;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Failed to delete doctor",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
};
