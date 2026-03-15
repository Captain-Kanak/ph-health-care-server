import status from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { UpdateDoctor } from "./doctor.interface";
import { Doctor, Prisma, User, UserRole } from "@prisma/client";
import { IQueryParams } from "../../../interfaces/query-builder.interface";
import {
  doctorFilterableFields,
  doctorIncludeConfig,
  doctorSearchableFields,
} from "./doctor.constant";
import { QueryBuilder } from "../../utils/query-builder";

const getAllDoctors = async (query: IQueryParams) => {
  try {
    // const queryBuilder = new QueryBuilder<
    //   Doctor,
    //   Prisma.DoctorWhereInput,
    //   Prisma.DoctorInclude
    // >(prisma.doctor, query, {
    //   searchableFields: doctorSearchableFields,
    //   filterableFields: doctorFilterableFields,
    // });

    // const result = await queryBuilder
    //   .search()
    //   .filter()
    //   .where({
    //     isDeleted: false,
    //   })
    //   .includes({
    //     user: true,
    //     specialities: true,
    //   })
    //   .dynamicIncludes(doctorIncludeConfig)
    //   .paginate()
    //   .sort()
    //   .fields()
    //   .execute();

    await prisma.doctor.findMany({
      skip: 0,
      take: 10,
      where: {
        isDeleted: false,
      },
    });

    const queryBuilder = new QueryBuilder<
      Doctor,
      Prisma.DoctorWhereInput,
      Prisma.DoctorInclude
    >(prisma.doctor, query, {
      searchableFields: doctorSearchableFields,
      filterableFields: doctorFilterableFields,
    });

    const result = await queryBuilder
      .paginate()
      .where({
        isDeleted: false,
      })
      .search()
      .filter()
      .sort()
      .execute();

    return {
      doctors: result.data,
      meta: result.meta,
    };
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to fetch doctors",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const getDoctorById = async (id: string): Promise<Doctor> => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: {
        id,
      },
      include: {
        specialities: {
          include: {
            speciality: true,
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

const updateDoctorById = async (
  id: string,
  payload: UpdateDoctor,
  user: User,
): Promise<Doctor> => {
  try {
    const isAdmin =
      user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;

    const isDoctorExists = await prisma.doctor.findUnique({ where: { id } });

    if (!isDoctorExists) {
      throw new AppError("Doctor not found", status.NOT_FOUND);
    }

    if (!isAdmin && user.id !== isDoctorExists.userId) {
      throw new AppError(
        "You are not authorized to update this doctor",
        status.FORBIDDEN,
      );
    }

    const { specialities, doctor } = payload;

    const result = await prisma.$transaction(async (trx) => {
      if (specialities && specialities.length > 0) {
        for (const speciality of specialities) {
          const shouldDelete = speciality.shouldDelete;

          if (shouldDelete) {
            await trx.doctorSpeciality.delete({
              where: {
                doctorId_specialityId: {
                  doctorId: id,
                  specialityId: speciality.specialityId,
                },
              },
            });
          } else {
            await trx.doctorSpeciality.upsert({
              where: {
                doctorId_specialityId: {
                  doctorId: id,
                  specialityId: speciality.specialityId,
                },
              },
              create: {
                doctorId: id,
                specialityId: speciality.specialityId,
              },
              update: {},
            });
          }
        }
      }

      const updatedDoctor = await trx.doctor.update({
        where: { id },
        data: doctor,
        include: {
          specialities: {
            include: {
              speciality: true,
            },
          },
        },
      });

      return updatedDoctor;
    });

    return result;
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

const deleteDoctorById = async (id: string, user: User): Promise<Doctor> => {
  try {
    const isAdmin =
      user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;

    const doctor = await prisma.doctor.findUnique({ where: { id } });

    if (!doctor) {
      throw new AppError("Doctor not found", status.NOT_FOUND);
    }

    if (!isAdmin && user.id !== doctor.userId) {
      throw new AppError(
        "You are not authorized to delete this doctor",
        status.FORBIDDEN,
      );
    }

    const result = await prisma.$transaction(async (trx) => {
      const deletedDoctor = await prisma.doctor.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
        include: {
          specialities: {
            include: {
              speciality: true,
            },
          },
        },
      });

      await trx.user.update({
        where: { id: deletedDoctor.userId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      await trx.doctorSpeciality.deleteMany({
        where: {
          doctorId: id,
        },
      });

      await trx.session.deleteMany({
        where: {
          userId: deletedDoctor.userId,
        },
      });

      return deletedDoctor;
    });

    return result;
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
