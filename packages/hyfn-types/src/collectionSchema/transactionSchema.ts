import { boolean, literal, number, object, string, z } from "zod";

export const transactionSchema = object({
  id: z.any(),

  customerId: string().length(24),
  amount: number(),
  storeId: string().length(24).or(literal("Hyfn")),
  transactionDate: z.any(),
  validated: boolean(),
});
