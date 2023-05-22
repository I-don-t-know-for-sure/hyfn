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

  userId: varchar("user_id"),
  name: varchar("name"),
  notificationTokens: varchar("notification_tokens").array(),
  transactionId: uuid("transaction_id"),
  orderId: varchar("order_id"),
  addresses: jsonb("addresses").array(),
  reportsIds: uuid("reports_ids").array(),
  subscribedToHyfnPlus: boolean("subscribed_to_hyfn_plus"),
  expirationDate: timestamp("expiration_date"),
});
const schema = createSelectSchema(customers);
export const zCustomer = z.object({
  ...schema.shape,
  notificationTokens: z.array(z.string()),
});

// export type tCustomer = z.infer<typeof zCustomer>;
