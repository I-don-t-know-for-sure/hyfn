


import { boolean, number, object, string, z } from "zod";

import { currenciesArray, measurementSystemArray } from "../constants";



export const productSchema = z.object({
  _id: z.any(),

  textInfo: z.object({
    title: z.string(),
    description: z.string(),
  }),
  pricing: z.object({
    price: z.number(),
    prevPrice: z.number().default(0).optional(),
    costPerItem: z.number().default(0).optional(),
    currency: z.enum(currenciesArray as any).default("LYD").optional(),
  }),
  barcode: z.string().default("").optional(),
  weightInKilo: z.number(),
  options: object({
    hasOptions: boolean(),
    options: object({
      minimumNumberOfOptionsForUserToSelect: number().default(0).optional(),
      maximumNumberOfOptionsForUserToSelect: number().default(1),
      isRequired: boolean().default(false),
      optionName: string(),
      optionValues: object({
        value: string(),
        key: string(),
        price: number(),
      }).array(),

      key: string(),
    }).array(),
  }),
  measurementSystem: z.enum(measurementSystemArray as any),
  isActive: boolean(),
  collections: object({ label: string(), value: string().length(24) }).array(),
  storeId: string().length(24),
  city: string(),
  images: string().array(),
}).describe('product')
