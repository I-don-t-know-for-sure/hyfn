import {
  boolean,
  pgTable,
  varchar,
  uuid,
  numeric,
  timestamp,
  index
} from "drizzle-orm/pg-core";
import {
  citiesArray,
  customerStatusArray,
  orderStatusArray,
  orderTypesArray,
  storeStatusArray
} from "hyfn-types";

import { createSelectSchema } from "drizzle-zod";

import * as z from "zod";

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    storeStatus: varchar("store_status", {
      enum: storeStatusArray
    })
      .array()
      .notNull(),
    storeId: uuid("store_id").notNull(),

    customerId: uuid("customer_id").notNull(),
    customerStatus: varchar("customer_status", { enum: customerStatusArray })
      .array()
      .notNull(),

    storePickupConfirmation: uuid("store_pickup_confirmation").defaultRandom(),
    paymentWindowCloseAt: timestamp("payment_window_close_at"),

    customerLat: numeric("customer_lat").notNull(),
    customerLong: numeric("customer_long").notNull(),
    customerAddress: varchar("customer_address"),

    city: varchar("city", { enum: citiesArray }),
    orderCost: numeric("order_cost").notNull(),
    storeServiceFee: numeric("store_service_fee").notNull(),
    deliveryFee: numeric("delivery_fee").notNull(),
    orderDate: timestamp("order_date").defaultNow(),
    deliveryDate: timestamp("delivery_date").defaultNow(),
    serviceFee: numeric("service_fee").notNull(),
    serviceFeePaid: boolean("service_fee_paid").default(false),
    orderType: varchar("order_type", {
      enum: orderTypesArray
    }).notNull(),

    totalCost: numeric("total_cost").notNull(),
    confirmationCode: uuid("confirmation_code").defaultRandom(),

    orderStatus: varchar("order_status", {
      enum: orderStatusArray
    })
      .array()
      .notNull(),
    toCity: varchar("to_city").notNull(),
    fromCity: varchar("from_city").notNull(),
    reportsIds: uuid("reports_ids").array().notNull()
  },
  (table) => {
    return {
      storeIdx: index("store_idx").on(table.storeId),
      storeStatusx: index("store_statusx").on(table.storeStatus),

      customerIdx: index("customer_idx").on(table.customerId),
      customerStatusx: index("customer_statusx").on(table.customerStatus)
    };
  }
);

const schema = createSelectSchema(orders);
export const zOrder = z.object({
  ...schema.shape,
  storeStatus: z.array(z.enum(storeStatusArray)),
  orderStatus: z.array(z.enum(orderStatusArray)),
  serviceFee: z.number(),
  storeServiceFee: z.number(),
  orderCost: z.number(),
  totalCost: z.number(),
  deliveryFee: z.number(),
  customerLat: z.number(),
  customerLong: z.number(),
  customerStatus: z.array(z.enum(customerStatusArray)),

  storeId: z.string(),

  customerId: z.string()
});

// export type Order = InferModel<typeof orders>;
