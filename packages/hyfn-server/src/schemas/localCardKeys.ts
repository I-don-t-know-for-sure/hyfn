import { boolean, pgTable, serial, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import * as z from "zod";

export const localCardKeys = pgTable("local_card_keys", {
  id: uuid("id").defaultRandom().primaryKey(),

  terminalId: varchar("terminal_id"),

  merchantId: varchar("merchant_id"),

  secretKey: varchar("secret_key"),
  inUse: boolean("in_use").default(true),
  storeId: varchar("store_id"),
});

const schmea = createSelectSchema(localCardKeys);
export const zLocalCardKeys = z.object({
  ...schmea.shape,
});

// export type LocalCardKeys = z.infer<typeof zLocalCardKeys>;
