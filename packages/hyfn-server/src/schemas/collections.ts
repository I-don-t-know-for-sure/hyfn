import {
  PgColumn,
  boolean,
  index,
  jsonb,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import * as z from "zod";
export const collections = pgTable(
  "collections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    collectionType: varchar("collection_type", { enum: ["manual"] }).notNull(),
    title: varchar("title").notNull(),
    description: varchar("description").notNull(),
    isActive: boolean("is_active").default(false),
    storeId: uuid("store_id").notNull(),
  },
  (table) => {
    return {
      storeIdx: index("store_idx").on(table.storeId),
    };
  }
);

const schema = createSelectSchema(collections);

export const zCollection = z.object({
  ...schema.shape,
});
// const arr = [];

// export type tCollections = z.infer<typeof zCollection>;
