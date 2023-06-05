import { InferModel, sql } from "drizzle-orm";

import {
  PgCustomColumnBuilder,
  boolean,
  customType,
  index,
  json,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { measurementSystemArray } from "hyfn-types";
import * as z from "zod";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").notNull(),
    price: numeric("price").notNull(),
    prevPrice: numeric("prev_price").notNull(),
    title: text("title").notNull(),
    description: varchar("description").notNull(),

    options: jsonb("options").array().notNull(),
    measurementSystem: varchar("measurement_system", {
      enum: measurementSystemArray,
    }).notNull(),
    whiteBackgroundImages: varchar("white_background_images").array().notNull(),
    isActive: boolean("is_active").default(false),
    hasOptions: boolean("has_options").default(false),

    images: varchar("images").array().notNull(),
  },
  (table) => {
    return {
      storeIdx: index("store_idx").on(table.storeId),
    };
  }
);

const schema = createInsertSchema(products);
export const zProduct = z.object({
  ...schema.shape,

  title: z.string(),
  description: z.string(),

  price: z.number(),

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
