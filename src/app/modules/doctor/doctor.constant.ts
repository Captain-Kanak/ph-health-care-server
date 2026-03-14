import { Prisma } from "@prisma/client";

export const doctorSearchableFields = [
  "name",
  "phone",
  "email",
  "qualification",
  "designation",
  "currentWorkingPlace",
  "registrationNumber",
  "specialities.speciality.title",
];

export const doctorFilterableFields = [
  "grender",
  "isDeleted",
  "appointmentFee",
  "experience",
  "registrationNumber",
  "specialities.specialityId",
  "currentWorkingPlace",
  "designation",
  "qualification",
  "specialities.speciality.title",
  "user.role",
];

export const doctorIncludeConfig: Partial<
  Record<
    keyof Prisma.DoctorInclude,
    Prisma.DoctorInclude[keyof Prisma.DoctorInclude]
  >
> = {
  user: true,
  specialities: {
    include: {
      speciality: true,
    },
  },
  appointments: {
    include: {
      doctor: true,
      patient: true,
      prescription: true,
      review: true,
    },
  },
  schedules: {
    include: {
      doctor: true,
    },
  },
};
