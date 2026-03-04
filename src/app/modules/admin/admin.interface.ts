import { Gender } from "@prisma/client";

export interface UpdateAdmin {
  name?: string;
  gender?: Gender;
  image?: string;
  phone?: string;
  address?: string;
}
