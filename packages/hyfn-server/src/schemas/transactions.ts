import {
  decimal,
  pgTable,
  varchar,
  uuid,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { transactionMethods, transactionTypesArray } from "hyfn-types";
import * as z from "zod";

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),

  customerId: varchar("customer_id").notNull(),
  amount: decimal("amount"),
  storeId: varchar("store_id").notNull(),
  transactionDate: timestamp("transaction_date").defaultNow(),
  type: varchar("type", { enum: transactionTypesArray }).notNull(),
  status: varchar("status").array().notNull(),
  transactionMethod: varchar("transaction_method", {
    enum: transactionMethods,
  }).notNull(),
  numberOfMonths: integer("number_of_months"),
  orderId: varchar("order_id"),
});

const schema = createSelectSchema(transactions);
export const zTransaction = z.object({
  ...schema.shape,
  transactionDate: z.date(),
  amount: z.number(),
  status: z.array(z.enum(["canceled", "validated", "initial"])),
});
