import * as z from "zod";

const CreateSpecialityZodSchema = z.object({
  title: z
    .string("Title is required")
    .max(100, "Title can't be longer than 100 characters"),
  description: z
    .string()
    .max(500, "Description can't be longer than 500 characters")
    .optional(),
  icon: z
    .string()
    .max(255, "Icon can't be longer than 255 characters")
    .optional(),
});

const UpdateSpecialityZodSchema = z
  .object({
    title: z.string().max(100, "Title can't be longer than 100 characters"),
    description: z
      .string()
      .max(500, "Description can't be longer than 500 characters"),
    icon: z.string().max(255, "Icon can't be longer than 255 characters"),
  })
  .partial();

export const SpecialityValidation = {
  CreateSpecialityZodSchema,
  UpdateSpecialityZodSchema,
};
