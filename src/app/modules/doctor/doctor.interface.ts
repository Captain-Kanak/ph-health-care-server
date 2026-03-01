import { Gender, Speciality } from "@prisma/client";

export interface UpdateDoctor {
  name?: string;
  image?: string;
  phone?: string;
  address?: string;
  registrationNumber?: string;
  experience?: number;
  gender?: Gender;
  appointmentFee?: number;
  qualification?: string;
  currentWorkingPlace?: string;
  designation?: string;
  specialities?: Speciality[];
}
