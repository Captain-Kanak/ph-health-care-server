import { Gender } from "@prisma/client";

export interface RegisterPatientPayload {
  name: string;
  email: string;
  password: string;
  gender: Gender;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}
