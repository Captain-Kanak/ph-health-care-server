import { Gender } from "@prisma/client";
import * as z from "zod";

const UpdateAdminValidationSchema = z
  .object({
    name: z.string().max(50, "Name can't be longer than 50 characters"),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
    image: z.url("Invalid URL format"),
    phone: z
      .string()
      .min(11, "Phone number must be at least 11 characters long")
      .max(14, "Phone number can't be longer than 14 characters"),
    address: z.string().max(500, "Address can't be longer than 500 characters"),
  })
  .partial();

export const AdminValidation = {
  UpdateAdminValidationSchema,
};
