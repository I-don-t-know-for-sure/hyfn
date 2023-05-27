import { boolean, pgTable, serial, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import * as z from "zod";

export const localCardKeys = pgTable("local_card_keys", {
  id: uuid("id").defaultRandom().primaryKey(),

  terminalId: varchar("terminal_id").notNull(),

  merchantId: varchar("merchant_id").notNull(),

  secretKey: varchar("secret_key").notNull(),
  inUse: boolean("in_use").default(true),
});

const schmea = createSelectSchema(localCardKeys);
export const zLocalCardKeys = z.object({
  ...schmea.shape,
});

// export type LocalCardKeys = z.infer<typeof zLocalCardKeys>;
