import {
  boolean,
  decimal,
  json,
  pgTable,
  serial,
  varchar,
  date,
  uuid,
  jsonb,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { citiesArray } from "hyfn-types";

import { InferModel, sql } from "drizzle-orm";

import { createSelectSchema } from "drizzle-zod";

import * as z from "zod";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  storeStatus: varchar("store_status", {
    enum: ["pending", "accepted", "paid", "preparing", "ready", "pickedUp"],
  }).array(),
  storeId: uuid("store_id"),
  driverId: uuid("driver_id"),
  customerId: uuid("customer_id"),
  customerStatus: varchar("customer_status").array(),
  driverStatus: varchar("driver_status").array(),
  storePickupConfirmation: uuid("store_pickup_confirmation").defaultRandom(),
  paymentWindowCloseAt: timestamp("payment_window_close_at"),

  customerLat: numeric("customer_lat"),
  customerLong: numeric("customer_long"),
  customerAddress: varchar("customer_address"),

  city: varchar("city", { enum: citiesArray }),
  orderCost: numeric("order_cost"),
  storeServiceFee: numeric("store_service_fee"),
  deliveryFee: numeric("delivery_fee"),
  orderDate: timestamp("order_date").defaultNow(),
  deliveryDate: timestamp("delivery_date").defaultNow(),
  serviceFee: numeric("service_fee"),
  serviceFeePaid: boolean("service_fee_paid").default(false),
  orderType: varchar("order_type", { enum: ["Delivery", "Pickup"] }),
  proposals: jsonb("proposals").array(),
  totalCost: numeric("total_cost"),
  confirmationCode: uuid("confirmation_code").defaultRandom(),
  proposalsIds: varchar("proposals_ids").array(),
  acceptedProposal: varchar("accepted_proposal"),
  driverManagement: varchar("driver_management"),

  orderStatus: varchar("order_status").array(),
  reportsIds: uuid("reports_ids").array(),
  deliveryFeePaid: boolean("delivery_fee_paid"),
});

const schema = createSelectSchema(orders);
export const zOrder = z.object({
  ...schema.shape,
  storeStatus: z.array(
    z.enum(["pending", "accepted", "paid", "preparing", "ready", "pickedUp"])
  ),
  orderStatus: z.array(
    z.enum(["active", "canceled", "delivered", "reporeted"])
  ),
  serviceFee: z.number(),
  storeServiceFee: z.number(),
  orderCost: z.number(),
  totalCost: z.number(),
  deliveryFee: z.number(),
  customerLat: z.number(),
  customerLong: z.number(),
  customerStatus: z.array(z.enum(["initial"])),
  driverStatus: z.array(z.enum(["initial", "set"])),
  storeId: z.string(),

  driverId: z.string(),

  customerId: z.string(),

  proposals: z.array(
    z.object({
      price: z.number(),
      driverId: z.string(),
      managementId: z.string(),
    })
  ),
});

// export type Order = InferModel<typeof orders>;
