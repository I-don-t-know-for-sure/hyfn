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
import { createInsertSchema } from "drizzle-zod";

import { citiesArray } from "hyfn-types";
import * as z from "zod";
// these are created when a customer makes an order to keep things
// stable and we are able to keep everything even after a store deletes a product
export const orderProducts = pgTable("order_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: varchar("store_id", { enum: ["test"] }),
  price: numeric("price"),
  orderId: uuid("order_id"),
  currency: varchar("currency", { enum: [""] }),
  prevPrice: numeric("prev_price"),
  title: varchar("title"),

  options: jsonb("options"),
  measurementSystem: varchar("measurement_system", { enum: [""] }),

  hasOptions: boolean("has_options").default(false),
  pickupStatus: varchar("pickup_status", {
    enum: ["initial", "pickedUp", "notFound"],
  }).array(),
  qtyFound: numeric("qty_found"),
  images: varchar("images").array(),
  city: varchar("city", { enum: citiesArray }),
  qty: numeric("qty"),
  instructions: varchar("instructions"),
});

const schema = createInsertSchema(orderProducts);
export const zOrderProducts = z.object({
  ...schema.shape,

  title: z.string(),
  description: z.string(),

  price: z.number(),
  currency: z.enum([""]),
  prevPrice: z.number(),
  qtyFound: z.number(),
  hasOptions: z.boolean(),
  pickupStatus: z.array(z.enum(["initial", "pickedUp", "notFound"])),
  options: z.array(
    z.object({
      optionName: z.string(),
      values: z.array(z.any()),
    })
  ),
});

// export type Product = InferModel<typeof products>;
