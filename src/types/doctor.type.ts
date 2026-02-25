import { Gender } from "@prisma/client";

export interface CreateDoctorPayload {
  password: string;
  doctor: {
    name: string;
    email: string;
    image?: string;
    phone?: string;
    address?: string;
    registrationNumber: string;
    experience: number;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
  };
  specialities: string[];
}

export interface UpdateDoctorPayload {
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
