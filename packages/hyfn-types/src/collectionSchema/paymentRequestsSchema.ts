





import { boolean, literal, number, object, string, z } from "zod";
import { adminName } from "../constants";

export const paymentRequestsSchema = object({
  _id: z.any(),



  merchantId: string().length(24),

  customerId: z.literal(adminName).or( z.string().length(24)),
  amount: number(),
  validated: boolean(),
  transactionDate: z.any(),
});
