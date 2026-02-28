import * as z from "zod";

const paramsIdZodSchema = z.object({
  id: z.uuid("UUID is invalid or missing"),
});

export { paramsIdZodSchema };
