import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import * as z from "zod";
export const productDescriptions = pgTable(
  "product_descriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull(),
    description: varchar("description").notNull(),
  },
  (table) => {
    return {
      productIdx: index("product_idx").on(table.productId),
    };
  }
);

const schema = createSelectSchema(productDescriptions);

export const zProductDescriptions = z.object({
  ...schema.shape,
});
