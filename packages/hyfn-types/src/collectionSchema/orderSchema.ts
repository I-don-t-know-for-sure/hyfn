import { boolean, literal, number, object, string, z } from "zod";
import {
  citiesArray,
  countriesArray,
  currenciesArray,
  orderStatusArray,
  storeTypesArray,
  userTypesArray,
} from "../constants";

export const orderSchema = object({
  id: z.any(),

  orders: object({
    id: z.any(),

    currency: z.enum(currenciesArray as any),
    // userId: string(),
    storeType: z.enum(storeTypesArray as any).array(),

    storeName: string(),
    storePhone: string(),
    country: z.enum(countriesArray as any),
    city: z.enum(citiesArray as any),

    address: string(),
    coords: object({
      type: literal("Point"),
      coordinates: number().array().length(2),
    }),
    orderStatus: z.enum(orderStatusArray as any),
    image: string().array(),
    orderType: z.enum(["Delivery", "Pickup"]),
    orderCost: number(),
  }).array(),
  userId: string(),
  name: string(),
  buyerCoords: number().array(),

  duration: number(),

  city: z.enum(citiesArray as any),

  distance: number(),
  orderCost: number(),

  drivingDuration: number(),
  inStoreDuration: number(),
  deliveryFee: number(),
  serviceFee: number(),
  originalDeliveryFee: number(),
  orderType: z.enum(["Delivery", "Pickup"]),
  status: object({
    id: string().length(24),
    status: string(),
    userType: z.enum(userTypesArray as any),
  }).array(),
  coords: object({
    type: literal("MultiPoint"),
    coordinates: number().array(),
  }),
  orderDate: z.any(),
  acceptedProposal: z.string(),
  proposalsIds: z.string().array(),
  proposals: z
    .object({ managementId: string(), driverId: string(), price: number() })
    .array(),
  confirmationCode: string().length(24),
  canceled: boolean().optional(),
});
