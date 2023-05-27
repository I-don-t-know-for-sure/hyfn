import {
  boolean,
  decimal,
  pgTable,
  serial,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import * as z from "zod";
export const drivers = pgTable("drivers", {
  id: uuid("id").defaultRandom().primaryKey(),

  driverName: varchar("driver_name").notNull(),

  driverPhone: varchar("driver_phone").notNull(),
  tarnsportationMethod: varchar("tarnsportation_method", {
    enum: ["Car"],
  }).notNull(),
  userId: varchar("user_id").notNull(),
  verified: boolean("verified").default(false),
  balance: decimal("balance").notNull(),
  driverManagement: varchar("driver_management"),
  notificationTokens: varchar("notification_tokens").array().notNull(),
  usedBalance: decimal("used_balance").notNull(),
  // reported: boolean("reported"),
  reportsIds: uuid("reports_ids").array().notNull(),
  removeDriverAfterOrder: boolean("remove_driver_after_order").default(false),
});

const schema = createSelectSchema(drivers);
export const zDriver = z.object({
  ...schema.shape,
  notificationTokens: z.array(z.string()),
  balance: z.number(),
  usedBalance: z.number(),
});

// export type Driver = z.infer<typeof zDriver>;
