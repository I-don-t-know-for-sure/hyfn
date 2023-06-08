import {
  decimal,
  pgTable,
  varchar,
  uuid,
  integer,
  timestamp,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import {
  transactionExplainationArray,
  transactionExplainationObject,
  transactionMethodsArray,
  transactionStatusArray,
  transactionTypesArray,
} from "hyfn-types";
import * as z from "zod";

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    customerId: varchar("customer_id").notNull(),
    amount: decimal("amount"),
    storeId: varchar("store_id").notNull(),
    transactionDate: timestamp("transaction_date").defaultNow(),
    type: varchar("type", { enum: transactionTypesArray }).notNull(),
    status: varchar("status").array().notNull(),
    transactionMethod: varchar("transaction_method", {
      enum: transactionMethodsArray,
    }).notNull(),
    numberOfMonths: integer("number_of_months"),
    orderId: varchar("order_id"),
    plus: jsonb("plus"),
    explaination: varchar("explaination", {enum: transactionExplainationArray}).array(),
  },
  (table) => {
    return {
      customerIdx: index("customer_idx").on(table.customerId),
      storeIdx: index("store_idx").on(table.storeId),
      orderIdx: index("order_idx").on(table.orderId),
    };
  }
);

const schema = createSelectSchema(transactions);
export const zTransaction = z.object({
  ...schema.shape,
  transactionDate: z.date(),
  amount: z.number(),
  status: z.array(z.enum(transactionStatusArray)),
  plus: z.object({
    [transactionExplainationObject["delivery fee"]]: z.number()
  }),
  explaination: z.array(z.enum(transactionExplainationArray))
});
