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
