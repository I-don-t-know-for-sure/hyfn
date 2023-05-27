import { InferModel } from "drizzle-orm";
import {
  boolean,
  json,
  pgTable,
  varchar,
  uuid,
  jsonb,
  numeric,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { countriesArray } from "hyfn-types";
import * as z from "zod";

export const driverManagements = pgTable("driver_managements", {
  id: uuid("id").defaultRandom().primaryKey(),

  managementName: varchar("management_name").notNull(),
  managementPhone: varchar("management_phone").notNull(),
  managementAddress: varchar("management_address").notNull(),
  country: varchar("country", {
    enum: countriesArray,
  }).notNull(),
  userId: uuid("user_id").notNull(),
  usersIds: uuid("users_ids").array().notNull(),
  users: jsonb("users").array().notNull(),
  verified: boolean("verified").default(false),
  profits: numeric("profits"),
  terminalId: varchar("terminal_id"),
  merchantId: varchar("merchant_id"),
  secureKey: varchar("secure_key"),
  localCardKeyFilled: boolean("local_card_key_filled").default(false),
});
const schema = createSelectSchema(driverManagements);
export const zDriverManagement = z.object({
  ...schema.shape,
  users: z.array(
    z.object({
      userId: z.string(),
      userType: z.enum(["owner", "employee"]),
    })
  ),
  notificationTokens: z.array(z.string()),
  profits: z.number(),
});

// export type tDriverManagement = InferModel<typeof driverManagements>;
