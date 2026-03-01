import * as z from "zod";

const ParamsIdZodSchema = z.object({
  id: z.uuid("UUID is invalid or missing"),
});

export { ParamsIdZodSchema };
