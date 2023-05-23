import { number, object, string, z } from "zod";
import { orderSchema } from "./orderSchema";

export const customerSchema = object({
  id: z.any(),

  name: string(),
  customerId: string(),
  order: orderSchema.omit({ id: true, canceled: true }),
  balance: number(),
  addresses: object({
    label: string(),
    coords: number().array(),
    key: string(),
    locationDescription: string(),
  }).array(),
});
