import { Gender } from "@prisma/client";
import * as z from "zod";

const RegisterPatientSchema = z.object({
  name: z
    .string("Name is required")
    .max(50, "Name can't be longer than 50 characters"),
  email: z
    .email("Invalid email address")
    .max(100, "Email can't be longer than 100 characters"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password can't be longer than 50 characters"),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
});

const LoginUserSchema = z.object({
  email: z
    .email("Invalid email address")
    .max(100, "Email can't be longer than 100 characters"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password can't be longer than 50 characters"),
});

export { RegisterPatientSchema, LoginUserSchema };
