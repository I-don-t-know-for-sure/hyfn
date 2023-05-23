import { boolean, object, string, z } from "zod";

export const localCardKeysSchema = object({
  id: z.any(),

  TerminalId: string(),

  MerchantId: string(),
  secretKey: string(),
  inUse: boolean(),
  storeId: string().length(24),
});
