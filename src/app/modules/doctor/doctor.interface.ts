import { Gender } from "@prisma/client";

interface UpdateSpeciality {
  specialityId: string;
  shouldDelete: boolean;
}

export interface UpdateDoctor {
  doctor: {
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
  };
  specialities: UpdateSpeciality[];
}
