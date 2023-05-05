import {
  boolean,
  decimal,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const drivers = pgTable("drivers", {
  _id: serial("_id").primaryKey(),
  driverName: varchar("driverName"),

  driverPhone: varchar("driverPhone"),
  tarnsportationMethod: varchar("tarnsportationMethod", { enum: [""] }),
  userId: varchar("userId"),
  verified: boolean("verified").default(false),
  balance: decimal("balance"),
  driverManagement: varchar("driverManagement"),
  notificationToken: varchar("notificationToken").array(),
  usedBalance: decimal("usedBalance"),
});
