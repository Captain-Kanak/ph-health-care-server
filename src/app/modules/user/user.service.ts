import { Admin, Speciality, User, UserRole, UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import status from "http-status";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { CreateAdmin, CreateDoctor } from "./user.interface";

const createAdmin = async (
  payload: CreateAdmin,
): Promise<{ user: User; admin: Admin }> => {
  try {
    const { password, admin } = payload;
    const { name, email, gender, image, phone, address } = admin;

    const isUserExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isUserExists) {
      throw new AppError(
        "User already exists with this email",
        status.CONFLICT,
      );
    }

    const userData = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        needPasswordChange: true,
        role: UserRole.ADMIN,
      },
    });

    if (!userData) {
      throw new AppError(
        "Failed to create admin user",
        status.INTERNAL_SERVER_ERROR,
      );
    }

    const adminData = await prisma.admin.create({
      data: {
        userId: userData.user.id,
        name,
        email,
        gender,
        image,
        phone,
        address,
      },
    });

    if (!adminData) {
      await prisma.user.delete({ where: { id: userData.user.id } });

      throw new AppError(
        "Failed to create admin",
        status.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      user: {
        id: userData.user.id,
        name: userData.user.name,
        email: userData.user.email,
        emailVerified: userData.user.emailVerified,
        needPasswordChange: userData.user.needPasswordChange,
        image: userData.user.image as string | null,
        role: userData.user.role as UserRole,
        status: userData.user.status as UserStatus,
        isDeleted: userData.user.isDeleted,
        deletedAt: userData.user.deletedAt as Date | null,
        createdAt: userData.user.createdAt,
        updatedAt: userData.user.updatedAt,
      },
      admin: adminData,
    };
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Failed to create admin",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const createDoctor = async (payload: CreateDoctor): Promise<any> => {
  try {
    const { password, doctor } = payload;

    const isUserExists = await prisma.user.findUnique({
      where: {
        email: doctor.email,
      },
    });

    if (isUserExists) {
      throw new AppError(
        "User already exists with this email",
        status.CONFLICT,
      );
    }

    const userData = await auth.api.signUpEmail({
      body: {
        name: doctor.name,
        email: doctor.email,
        password: password,
        needPasswordChange: true,
        role: UserRole.DOCTOR,
      },
    });

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

    const result = await prisma.$transaction(async (trx) => {
      const createDoctor = await trx.doctor.create({
        data: {
          userId: userData.user.id,
          ...doctor,
        },
      });

      const specialityData = specialities.map((speciality) => ({
        doctorId: createDoctor.id,
        specialityId: speciality.id,
      }));

      await trx.doctorSpeciality.createMany({
        data: specialityData,
      });

      const findDoctor = await trx.doctor.findUnique({
        where: {
          id: createDoctor.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
          address: true,
          gender: true,
          registrationNumber: true,
          experience: true,
          qualification: true,
          designation: true,
          appointmentFee: true,
          currentWorkingPlace: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
          specialities: {
            select: {
              speciality: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  icon: true,
                },
              },
            },
          },
        },
      });

      return findDoctor;
    });

    if (!result) {
      await prisma.user.delete({
        where: {
          id: userData.user.id,
        },
      });

      throw new AppError(
        "Failed to create doctor",
        status.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to create doctor",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const UserService = {
  createAdmin,
  createDoctor,
};
