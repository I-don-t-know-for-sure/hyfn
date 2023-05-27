import {
  boolean,
  jsonb,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

import * as z from "zod";

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(),
  notificationTokens: varchar("notification_tokens").array().notNull(),
  transactionId: uuid("transaction_id"),

  addresses: jsonb("addresses").array().notNull(),
  reportsIds: uuid("reports_ids").array().notNull(),
  subscribedToHyfnPlus: boolean("subscribed_to_hyfn_plus").default(false),
  expirationDate: timestamp("expiration_date"),
});
const schema = createSelectSchema(customers);
export const zCustomer = z.object({
  ...schema.shape,
  notificationTokens: z.array(z.string()),
});

// export type tCustomer = z.infer<typeof zCustomer>;
