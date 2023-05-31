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
  index,
} from "drizzle-orm/pg-core";
import { citiesArray } from "hyfn-types";

import { InferModel, sql } from "drizzle-orm";

import { createSelectSchema } from "drizzle-zod";

import * as z from "zod";

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    storeStatus: varchar("store_status", {
      enum: ["pending", "accepted", "paid", "preparing", "ready", "pickedUp"],
    })
      .array()
      .notNull(),
    storeId: uuid("store_id").notNull(),
    driverId: uuid("driver_id"),
    customerId: uuid("customer_id").notNull(),
    customerStatus: varchar("customer_status").array().notNull(),
    driverStatus: varchar("driver_status").array().notNull(),
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
      enum: ["Delivery", "Pickup"],
    }).notNull(),
    proposals: jsonb("proposals").array().notNull(),
    totalCost: numeric("total_cost").notNull(),
    confirmationCode: uuid("confirmation_code").defaultRandom(),
    proposalsIds: varchar("proposals_ids").array().notNull(),
    // the acceptedProposal is the id of the driver that made the proposal
    acceptedProposal: varchar("accepted_proposal"),
    driverManagement: varchar("driver_management"),

    orderStatus: varchar("order_status").array().notNull(),
    reportsIds: uuid("reports_ids").array().notNull(),
    deliveryFeePaid: boolean("delivery_fee_paid").default(false),
  },
  (table) => {
    return {
      storeIdx: index("store_idx").on(table.storeId),
      storeStatusx: index("store_statusx").on(table.storeStatus),

      driverIdx: index("driver_idx").on(table.driverId),
      driverStatusx: index("driver_statusx").on(table.driverStatus),
      customerIdx: index("customer_idx").on(table.customerId),
      customerStatusx: index("customer_statusx").on(table.customerStatus),
      acceptedProposalx: index("accepted_proposalx").on(table.acceptedProposal),
      driverManagementx: index("driver_managementx").on(table.driverManagement),
    };
  }
);

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
