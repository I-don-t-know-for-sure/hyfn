import {
  boolean,
  decimal,
  pgTable,
  serial,
  varchar,
  date,
} from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  _id: serial("_id").primaryKey(),
  customerId: varchar("customerId"),
  amount: decimal("amount"),
  storeId: varchar("storeId"),
  transactionDate: date("transactionDate").defaultNow(),
  type: varchar("type", { enum: [""] }),
  validated: boolean("validated").default(false),
});
