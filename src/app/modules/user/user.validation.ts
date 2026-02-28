import * as z from "zod";

const createAdminValidationSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  admin: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email format"),
    profilePhoto: z.url("Invalid URL format").optional(),
    contactNumber: z.string().min(1, "Contact number is required"),
  }),
});

export const UserValidation = {
  createAdminValidationSchema,
};
