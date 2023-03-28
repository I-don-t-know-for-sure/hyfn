





import { boolean, number, object, string, z } from "zod";

export const driverSchema = object({
  _id: z.any(),


  driverName: string(),
  driverPhone: string(),
  passportNumber: string(),
  tarnsportationMethod: z.string(),
  passportPic: string().array(),
  passportAndFacePic: string().array(),
  driverId: string().length(24),
  verified: boolean(),
  onDuty: boolean(),
  orderId: string().length(0).or(string().length(24)),
  balance: number(),
  driverManagement: string().length(24).array(),
  managementCut: number().max(1),
});
