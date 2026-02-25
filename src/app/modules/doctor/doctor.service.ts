import status from "http-status";
import { AppError } from "../../utils/AppError";
import { prisma } from "../../lib/prisma";

interface UpdateDoctorPayload {
  name?: string;
  email?: string;
  image?: string;
  phone?: string;
  address?: string;
  registrationNumber?: string;
  experience?: number;
  gender?: string;
  appointmentFee?: number;
  qualification?: string;
  currentWorkingPlace?: string;
  designation?: string;
  specialities?: string[];
}

const getAllDoctors = async () => {
  try {
    const doctors = await prisma.doctor.findMany({
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

    return doctors;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to fetch doctors",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const DoctorService = {
  getAllDoctors,
};
