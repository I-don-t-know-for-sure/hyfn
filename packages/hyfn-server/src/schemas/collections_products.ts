import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import * as z from "zod";
export const collectionsProducts = pgTable("collections_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull(),
  collectionId: uuid("collection_id").notNull(),
});

const schema = createSelectSchema(collectionsProducts);

export const zCollectionsProducts = z.object({
  ...schema.shape,
});
