import {
  boolean,
  date,
  decimal,
  json,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { citiesArray, countriesArray, storeTypesArray } from "hyfn-types";
import * as z from "zod";
// const cities = pgEnum("cities", citiesArray);

type StoreDoc = {
  id: string;
  storeFrontId: string;
  country: string;
  city: string;
};

type SubscriptionInfo = {
  timeOfPayment: string;
  numberOfMonths: number;
  expirationDate: string;
};

type LocalCardAPIKey = {
  TerminalId: string;
  MerchantId: string;
  secretKey: string;
};

type Users = {
  [key: string]: {
    userType: "employee" | "owner";
  };
};

export const stores = pgTable("stores", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id").notNull(),

  storeType: varchar("store_type", {
    enum: [...storeTypesArray],
  })
    .array()
    .notNull(),
  storeName: varchar("store_name").notNull(),
  storePhone: varchar("store_phone").notNull(),
  country: varchar("country", {
    enum: countriesArray,
  }).notNull(),
  city: varchar("city", { enum: citiesArray }).notNull(),

  description: varchar("description").notNull(),
  address: varchar("address").notNull(),
  storeInfoFilled: boolean("store_info_filled").default(false),

  usersIds: uuid("users_ids").array().notNull(),
  users: jsonb("users").array().notNull(),
  timeOfPayment: timestamp("time_of_payment"),
  expirationDate: timestamp("expiration_date"),
  numberOfMonths: numeric("number_of_months", { precision: 3, scale: 0 }),

  lat: numeric("lat").notNull(),
  long: numeric("long").notNull(),
  opened: boolean("opened").default(false),
  balance: numeric("balance").notNull(),

  image: varchar("image").array().notNull(),
  notificationTokens: varchar("notification_tokens").array().notNull(),
  storeOwnerInfoFilled: boolean("store_owner_info_filled").default(false),
  ownerLastName: varchar("owner_last_name"),
  ownerFirstName: varchar("owner_first_name"),
  ownerPhoneNumber: varchar("owner_phone_number"),
  sadadFilled: boolean("sadad_filled").default(false),

  monthlySubscriptionPaid: boolean("monthly_subscription_paid").default(false),
  // subscriptionInfo: jsonb("subscriptionInfo"),
  localCardApiKeyId: uuid("local_card_api_key_id"),

  acceptingOrders: boolean("accepting_orders").default(false),
  includeLocalCardFeeToPrice: boolean(
    "include_local_card_fee_to_price"
  ).default(true),
});

const schema = createSelectSchema(stores);
export const zStore = z.object({
  ...schema.shape,

  timeOfPayment: z.nullable(z.date()),
  expirationDate: z.nullable(z.date()),
  numberOfMonths: z.nullable(z.number()),
  storeType: z.array(z.enum(storeTypesArray)),
  lat: z.number(),
  long: z.number(),
  balance: z.nullable(z.number()),
  users: z.array(
    z.object({
      userId: z.string(),
      userType: z.string(),
    })
  ),
  notificationToken: z.nullable(z.array(z.string())),
});

// export type Store = z.infer<typeof zStore>;
