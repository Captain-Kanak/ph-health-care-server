import * as z from "zod";

export const paramsIdZodSchema = z.object({
  id: z.uuid("Id is required"),
});
