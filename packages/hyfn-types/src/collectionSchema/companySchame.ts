import { boolean, literal, number, object, string, z } from "zod";
import { citiesArray, countriesArray, storeTypesArray } from "../constants";

export const companySchame = object({
  id: z.any(),

  userId: string(),
  companyDoc: object({
    id: string().length(24),
    country: z.enum(countriesArray as any),
    city: z.enum(citiesArray as any),
  }),
  address: string(),
  companyType: z.enum(storeTypesArray as any).array(),

  companyName: string(),
  companyPhone: string(),

  country: z.enum(countriesArray as any),
  city: z.enum(citiesArray as any),

  agreeToTermsofService: boolean(),
  coords: object({
    type: literal("Point"),
    coordinates: number().array(),
  }),

  image: string().array(),
});
