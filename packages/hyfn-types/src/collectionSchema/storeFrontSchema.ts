import { array, boolean, literal, number, object, string, z } from "zod";
import {
  citiesArray,
  countriesArray,
  currenciesArray,
  storeTypesArray,
} from "../constants";

export const storeFrontSchema = object({
  id: z.any(),

  currency: z.enum(currenciesArray as any),
  storeType: z.enum(storeTypesArray as any).array(),

  storePhone: string(),
  storeName: string(),
  images: string().array(),
  description: string(),
  country: z.enum(countriesArray as any),

  city: z.enum(citiesArray as any),
  opened: boolean(),
  coords: object({
    type: literal("type"),
    coordinates: number().array(),
  }),
});
