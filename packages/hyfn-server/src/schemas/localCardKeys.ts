import { boolean, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const localCardKeys = pgTable("localCardKeys", {
  _id: serial("_id").primaryKey(),

  TerminalId: varchar("TerminalId"),

  MerchantId: varchar("MerchantId"),

  secretKey: varchar("secretKey"),
  inUse: boolean("inUse").default(true),
  storeId: varchar("storeId"),
});
