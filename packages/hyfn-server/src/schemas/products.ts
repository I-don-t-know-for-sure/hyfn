import { InferModel } from "drizzle-orm";

import {
  boolean,
  json,
  jsonb,
  numeric,
  pgTable,
  serial,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { citiesArray } from "hyfn-types";
import * as z from "zod";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id"),
  price: numeric("price"),

  currency: varchar("currency", { enum: [""] }),
  prevPrice: numeric("prev_price"),
  title: varchar("title"),
  description: varchar("description"),
  pricing: jsonb("pricing"),

  options: jsonb("options").array(),
  measurementSystem: varchar("measurement_system", { enum: [""] }),
  whiteBackgroundImages: varchar("white_background_images").array(),
  isActive: boolean("is_active").default(false),
  hasOptions: boolean("has_options").default(false),

  images: varchar("images").array(),
  city: varchar("city", { enum: citiesArray }),
});

const schema = createInsertSchema(products);
export const zProduct = z.object({
  ...schema.shape,

  title: z.string(),
  description: z.string(),

  price: z.number(),
  currency: z.enum([""]),
  prevPrice: z.number(),

  options: z.array(
    z.object({
      minimumNumberOfOptionsForUserToSelect: z.number(),
      maximumNumberOfOptionsForUserToSelect: z.number(),
      key: z.string(),
      isRequired: z.boolean(),
      optionName: z.string(),
      optionValues: z.array(z.any()),
    })
  ),
});

// export type Product = InferModel<typeof products>;
