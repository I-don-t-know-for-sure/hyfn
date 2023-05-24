import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import * as z from "zod";
export const productDescriptions = pgTable("collections_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull(),
  description: varchar("description"),
});

const schema = createSelectSchema(productDescriptions);

export const zProductDescriptions = z.object({
  ...schema.shape,
});
