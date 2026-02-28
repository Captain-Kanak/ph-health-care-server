import { UserRole, UserStatus } from "@prisma/client";

export interface RegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

export interface DecodedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
}
