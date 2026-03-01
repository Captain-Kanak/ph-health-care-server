import { Gender } from "@prisma/client";

export interface CreateAdmin {
  password: string;
  admin: {
    name: string;
    email: string;
    gender: Gender;
    image?: string;
    phone?: string;
    address?: string;
  };
}

export interface CreateDoctor {
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
