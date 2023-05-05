import {
  boolean,
  decimal,
  json,
  pgTable,
  serial,
  text,
  varchar,
  date,
} from "drizzle-orm/pg-core";
import { citiesArray, countriesArray, storeTypesArray } from "hyfn-types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { Option } from "aws-sdk/clients/rds";
import { InferModel } from "drizzle-orm";

export const driverManagements = pgTable("driverManagements", {
  _id: serial("_id").primaryKey(),
  managementName: varchar("managementName"),
  managementPhone: varchar("managementPhone"),
  managementAddress: varchar("managementAddress"),
  country: varchar("country", {
    enum: countriesArray as [string, ...string[]],
  }),
  userId: varchar("userId"),
  usersIds: varchar("usersIds").array(),
  users: json("users").$type<{
    [key: string]: {
      userType: "employee" | "owner";
    };
  }>(),
  verified: boolean("verified").default(false),
});
