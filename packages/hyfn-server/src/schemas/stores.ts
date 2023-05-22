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
  userId: varchar("user_id"),

  storeType: varchar("store_type", {
    enum: [...storeTypesArray],
  }).array(),
  storeName: varchar("store_name"),
  storePhone: varchar("store_phone"),
  country: varchar("country", {
    enum: countriesArray,
  }),
  city: varchar("city", { enum: citiesArray }),

  description: varchar("description"),
  address: varchar("address"),
  storeInfoFilled: boolean("store_info_filled").default(false),
  currency: varchar("currency", { enum: ["LYD"] }),
  usersIds: uuid("users_ids").array(),
  users: jsonb("users").array(),
  timeOfPayment: timestamp("time_of_payment"),
  expirationDate: timestamp("expiration_date"),
  numberOfMonths: numeric("number_of_months", { precision: 3, scale: 0 }),
  // TerminalId: varchar("TerminalId"),
  // MerchantId: varchar("MerchantId"),
  // secretKey: varchar("secretKey"),
  lat: numeric("lat"),
  long: numeric("long"),
  opened: boolean("opened").default(false),
  balance: numeric("balance", { precision: 3, scale: 2 }),

  image: varchar("image").array(),
  notificationToken: varchar("notification_token").array(),
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
