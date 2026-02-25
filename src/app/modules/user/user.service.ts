import { Speciality, UserRole } from "@prisma/client";
import AppError from "../../utils/AppError";
import status from "http-status";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { CreateDoctorPayload } from "../../../types/doctor.type";

const createDoctor = async (payload: CreateDoctorPayload) => {
  try {
    const specialities: Speciality[] = [];

    for (const specialityId of payload.specialities) {
      const speciality = await prisma.speciality.findUnique({
        where: {
          id: specialityId,
        },
      });

      if (!speciality) {
        throw new AppError("Speciality not found", status.NOT_FOUND);
      }

      specialities.push(speciality);
    }

    const isUserExists = await prisma.user.findUnique({
      where: {
        email: payload.doctor.email,
      },
    });

    if (isUserExists) {
      throw new AppError(
        "User already exists with this email",
        status.CONFLICT,
      );
    }

    const doctorData = payload.doctor;

    const userData = await auth.api.signUpEmail({
      body: {
        name: doctorData.name,
        email: doctorData.email,
        password: payload.password,
        needPasswordChange: true,
        role: UserRole.DOCTOR,
      },
    });

    const doctor = await prisma.$transaction(async (trx) => {
      const createDoctorData = await trx.doctor.create({
        data: {
          userId: userData.user.id,
          ...doctorData,
        },
      });

      const specialityData = specialities.map((speciality) => ({
        doctorId: createDoctorData.id,
        specialityId: speciality.id,
      }));

      await trx.doctorSpeciality.createMany({
        data: specialityData,
      });

      const doctor = await trx.doctor.findUnique({
        where: {
          id: createDoctorData.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          designation: true,
          image: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
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

      return doctor;
    });

    if (!doctor) {
      await prisma.user.delete({
        where: {
          id: userData.user.id,
        },
      });
    }

    return doctor;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to create doctor",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const UserService = {
  createDoctor,
};
