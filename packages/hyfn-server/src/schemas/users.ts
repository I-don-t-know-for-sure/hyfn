import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  _id: serial("_id").primaryKey(),
  userId: varchar("userId"),
  name: varchar("name"),
  notificationTokens: varchar("notificationTokens").array(),
  orderId: varchar("orderId"),
});
