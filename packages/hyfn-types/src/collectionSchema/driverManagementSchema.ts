





import { boolean, number, object, string, z } from "zod";
import { countriesArray } from "../constants";

export const driverManagementSchema = object({
  _id: z.any(),


  managementName: string(),
  managementPhone: string(),
  managementAddress: string(),
  userId: string(),
  managementCut: number().max(1),
  country: z.enum(countriesArray as any),

  usedBalance: number(),

  balance: number(),
  verified: boolean(),
  localCardAPIKeyFilled: boolean(),
  localCardKeys: object({
    TerminalId: string(),
    MerchantId: string(),
    secretKey: string(),
  }),
  profits: number(),
});
