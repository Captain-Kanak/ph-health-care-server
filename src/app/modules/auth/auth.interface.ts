import { Gender } from "@prisma/client";

export interface RegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}
