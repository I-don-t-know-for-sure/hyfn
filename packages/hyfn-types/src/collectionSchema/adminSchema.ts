import { object, string, z } from "zod";

export const adminSchema = object({
  id: z.any(),
  adminName: string(),
  userId: string(),
}).required();
