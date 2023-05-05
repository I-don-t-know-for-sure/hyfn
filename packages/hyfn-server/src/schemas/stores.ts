import {
  boolean,
  decimal,
  json,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { citiesArray, countriesArray, storeTypesArray } from "hyfn-types";

export const stores = pgTable("store", {
  _id: serial("_id").primaryKey(),
  userId: varchar("userId"),
  storeType: varchar("storeType", {
    enum: [...storeTypesArray] as [string, ...string[]],
  }),
  storeName: varchar("storeName"),
  storePhone: varchar("storePhone"),
  country: varchar("country", {
    enum: countriesArray as [string, ...string[]],
  }),
  city: varchar("city", { enum: citiesArray as [string, ...string[]] }),
  description: varchar("description"),
  address: varchar("address"),
  storeInfoFilled: boolean("storeInfoFilled").default(false),
  currency: varchar("currency", { enum: ["LYD"] }),
  usersIds: varchar("usersIds").array(),
  users: json("users").$type<{
    [key: string]: {
      userType: "employee" | "owner";
    };
  }>(),
  storeDoc: json("storeDoc").$type<{
    id: string;
    storeFrontId: string;
    country: string;
    city: string;
  }>(),
  opened: boolean("opened").default(false),
  balance: decimal("balance", { precision: 3, scale: 2 }),
  coords: json("coords").$type<{
    type: "Point";
    coordinates: number[];
  }>(),
  image: varchar("image").array(),
  notificationToken: varchar("notificationToken").array(),
  storeOwnerInfoFilled: boolean("storeOwnerInfoFilled").default(false),
  ownerLastName: varchar("ownerLastName"),
  ownerFirstName: varchar("ownerFirstName"),
  ownerPhoneNumber: varchar("ownerPhoneNumber"),
  sadadFilled: boolean("sadadFilled").default(false),
  localCardAPIKeyFilled: boolean("localCardAPIKeyFilled").default(false),
  monthlySubscriptionPaid: boolean("monthlySubscriptionPaid").default(false),
  subscriptionInfo: json("subscriptionInfo").$type<{
    timeOfPayment: string;
    numberOfMonths: number;
    expirationDate: string;
  }>(),
  localCardAPIKey: json("localCardAPIKey").$type<{
    TerminalId: string;
    MerchantId: string;
    secretKey: string;
  }>(),
  acceptingOrders: boolean("acceptingOrders").default(false),
  collections: json("collections")
    .$type<{
      collectionName: string;
      collectionId: string;
    }>()
    .array(),
});
