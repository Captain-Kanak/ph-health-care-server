import * as z from "zod";

export const paramsIdZodSchema = z.object({
  id: z.uuid("UUID is invalid or missing"),
});
