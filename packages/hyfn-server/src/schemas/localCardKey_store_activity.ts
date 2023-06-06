import { boolean, pgTable, serial, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import * as z from "zod";

export const localCardKeyStoreActivity = pgTable(
  "local_card_key_store_activity",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    localCardKeyId: uuid("local_card_key_id").notNull(),
    // for store and driverManagement id
    storeId: uuid("store_id").notNull(),
  }
);

const schmea = createSelectSchema(localCardKeyStoreActivity);
export const zLocalCardKeyStoreActivity = z.object({
  ...schmea.shape,
});

// export type LocalCardKeys = z.infer<typeof zLocalCardKeys>;
