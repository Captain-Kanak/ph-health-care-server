import { Prisma } from "@prisma/client";

export const doctorSearchableFields = [
  "name",
  "user.name",
  "phone",
  "email",
  "address",
  "qualification",
  "designation",
  "currentWorkingPlace",
  "registrationNumber",
  "specialities.speciality.title",
];

export const doctorFilterableFields = [
  "appointmentFee",
  "gender",
  "experience",
  "registrationNumber",
  "currentWorkingPlace",
  "designation",
  "qualification",
  "specialities.specialityId",
  "specialities.speciality.title",
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
