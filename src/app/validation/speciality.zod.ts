import * as z from "zod";

const SpecialityZodSchema = z.object({
  title: z
    .string("Title is required")
    .max(100, "Title can't be longer than 100 characters"),
  description: z.string().optional(),
  icon: z
    .string()
    .max(255, "Icon can't be longer than 255 characters")
    .optional(),
});

export { SpecialityZodSchema };
