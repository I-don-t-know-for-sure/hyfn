import { InferModel } from "drizzle-orm";

import {
  boolean,
  index,
  json,
  jsonb,
  numeric,
  pgTable,
  serial,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { citiesArray, measurementSystemArray } from "hyfn-types";
import * as z from "zod";
// these are created when a customer makes an order to keep things
// stable and we are able to keep everything even after a store deletes a product
export const orderProducts = pgTable(
  "order_products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: varchar("store_id").notNull(),
    price: numeric("price").notNull(),
    orderId: uuid("order_id").notNull(),

    prevPrice: numeric("prev_price").notNull(),
    title: varchar("title").notNull(),

    options: jsonb("options").notNull(),
    measurementSystem: varchar("measurement_system", {
      enum: measurementSystemArray,
    }),

    hasOptions: boolean("has_options").default(false).notNull(),
    pickupStatus: varchar("pickup_status", {
      enum: ["initial", "pickedUp", "notFound"],
    })
      .array()
      .notNull(),
    qtyFound: numeric("qty_found").notNull(),
    images: varchar("images").array().notNull(),

    qty: numeric("qty").notNull(),
    instructions: varchar("instructions"),
  },
  (table) => {
    return {
      storeIdx: index("store_idx").on(table.storeId),
      orderIdx: index("order_idx").on(table.orderId),
    };
  }
);

const schema = createInsertSchema(orderProducts);
export const zOrderProducts = z.object({
  ...schema.shape,

  title: z.string(),
  description: z.string(),

  price: z.number(),

  prevPrice: z.number(),
  qtyFound: z.number(),
  hasOptions: z.boolean(),
  pickupStatus: z.array(z.enum(["initial", "pickedUp", "notFound"])),
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
