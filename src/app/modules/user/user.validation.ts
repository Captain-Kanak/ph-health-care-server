import { Gender } from "@prisma/client";
import * as z from "zod";

const CreateAdminValidationSchema = z.object({
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password can't be longer than 50 characters"),
  admin: z.object({
    name: z
      .string("Name is required")
      .max(50, "Name can't be longer than 50 characters"),
    email: z
      .email("Invalid email format")
      .max(100, "Email can't be longer than 100 characters"),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
    image: z.url("Invalid URL format").optional(),
    phone: z
      .string()
      .min(11, "Phone number must be at least 11 characters long")
      .max(14, "Phone number can't be longer than 14 characters")
      .optional(),
    address: z
      .string()
      .max(500, "Address can't be longer than 500 characters")
      .optional(),
  }),
});

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

export const UserValidation = {
  CreateAdminValidationSchema,
  UpdateAdminValidationSchema,
};
