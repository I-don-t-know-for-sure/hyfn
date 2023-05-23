import { boolean, literal, number, object, string, z } from "zod";
import {
  citiesArray,
  collectionTypesArray,
  countriesArray,
  currenciesArray,
  storeTypesArray,
} from "../constants";

export const storeSchema = object({
  id: z.any(),

  currency: z.enum(currenciesArray as any),
  userId: string(),
  storeDoc: object({
    id: string().length(24),
    storeFrontId: string().length(24),
    country: z.enum(countriesArray as any),
    city: z.enum([""]),
  }),
  storeType: z.enum(storeTypesArray as any).array(),
  storeName: string(),
  includeLocalCardFeeToPrice: boolean().default(false),
  storePhone: string(),
  country: z.enum(countriesArray as any),
  city: z.enum(citiesArray as any),
  description: string(),

  address: string(),
  storeInfoFilled: boolean(),

  opened: boolean(),

  balance: number(),
  coords: object({
    type: literal("Point"),
    coordinates: number().array(),
  }),
  collections: object({
    textInfo: object({
      title: string(),

      description: string(),
    }),
    collectionType: z.enum(collectionTypesArray as any),
    isActive: boolean(),
    id: string().length(24),
  }).array(),
  image: string().array(),
  ownerFirstName: string(),
  ownerLastName: string(),

  ownerPhoneNumber: string(),
  storeOwnerInfoFilled: boolean(),

  monthlySubscriptionPaid: boolean(),
  subscriptionInfo: object({
    timeOfPayment: z.any(),
    numberOfMonths: number(),

    expirationDate: z.any(),
  }),
  sales: number(),
  localCardAPIKey: object({
    TerminalId: string(),

    MerchantId: string(),

    secretKey: string(),
  }),
  localCardAPIKeyFilled: boolean(),
});
