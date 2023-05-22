import {
  PgColumn,
  boolean,
  jsonb,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import * as z from "zod";
export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  collectionType: varchar("collection_type", { enum: ["manual"] }),
  title: varchar("title"),
  description: varchar("description"),
  isActive: boolean("is_active").default(false),
  storeId: uuid("store_id"),
});

const schema = createSelectSchema(collections);

export const zCollection = z.object({
  ...schema.shape,
});
// const arr = [];

// export type tCollections = z.infer<typeof zCollection>;
