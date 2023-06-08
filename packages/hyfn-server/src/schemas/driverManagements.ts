import { InferModel } from "drizzle-orm";
import {
  boolean,
  json,
  pgTable,
  varchar,
  uuid,
  jsonb,
  numeric,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { countriesArray, userTypesArray } from "hyfn-types";
import * as z from "zod";

export const driverManagements = pgTable(
  "driver_managements",
  {
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

    localCardApiKeyId: uuid("local_card_api_key_id"),
  },
  (table) => {
    return {
      userIdx: uniqueIndex("driver_management_user_idx").on(table.userId),
      usersIds: index("users_idsx").on(table.usersIds),
      localCardApiKeyIdx: uniqueIndex("local_card_api_key_idx").on(
        table.localCardApiKeyId
      ),
    };
  }
);
const schema = createSelectSchema(driverManagements);
export const zDriverManagement = z.object({
  ...schema.shape,
  users: z.array(
    z.object({
      userId: z.string(),
      userType: z.enum(userTypesArray),
    })
  ),
  notificationTokens: z.array(z.string()),
  profits: z.number(),
});

// export type tDriverManagement = InferModel<typeof driverManagements>;
