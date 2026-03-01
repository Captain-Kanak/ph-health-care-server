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

const CreateDoctorZodSchema = z.object({
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password can't be longer than 50 characters"),
  doctor: z.object({
    name: z
      .string("Name is required")
      .max(50, "Name can't be longer than 50 characters"),
    email: z
      .email("Invalid email address")
      .max(100, "Email can't be longer than 100 characters"),
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
    registrationNumber: z
      .string("Registration number is required")
      .max(50, "Registration number can't be longer than 50 characters"),
    experience: z
      .number("Experience is required")
      .min(2, "Experience must be at least 2 years"),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
    appointmentFee: z.number("Appointment fee is required"),
    qualification: z
      .string("Qualification is required")
      .max(500, "Qualification can't be longer than 500 characters"),
    currentWorkingPlace: z
      .string("Current working place is required")
      .max(500, "Current working place can't be longer than 500 characters"),
    designation: z
      .string("Designation is required")
      .max(500, "Designation can't be longer than 500 characters"),
  }),
  specialities: z
    .array(z.uuid(), "Specialities are required")
    .min(1, "At least one speciality is required"),
});

export const UserValidation = {
  CreateAdminValidationSchema,
  CreateDoctorZodSchema,
  UpdateAdminValidationSchema,
};
