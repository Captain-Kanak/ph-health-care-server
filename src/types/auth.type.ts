import { UserRole, UserStatus } from "@prisma/client";

export interface DecodedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
}
