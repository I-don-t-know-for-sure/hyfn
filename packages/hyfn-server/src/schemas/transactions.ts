import {
  boolean,
  decimal,
  pgTable,
  serial,
  varchar,
  date,
  uuid,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { transactionMethods, transactionTypesArray } from "hyfn-types";
import * as z from "zod";

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),

  customerId: varchar("customer_id"),
  amount: decimal("amount"),
  storeId: varchar("store_id"),
  transactionDate: timestamp("transaction_date").defaultNow(),
  type: varchar("type", { enum: transactionTypesArray }),
  status: varchar("status").array(),
  transactionMethod: varchar("transaction_method", {
    enum: transactionMethods,
  }),
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

// export type Transaction = z.infer<typeof zTransaction>;
