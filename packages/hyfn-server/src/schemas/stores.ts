import {
  boolean,
  date,
  decimal,
  index,
  json,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { citiesArray, countriesArray, storeTypesArray } from "hyfn-types";
import * as z from "zod";

// const cities = pgEnum("cities", citiesArray);

export const stores = pgTable(
  "stores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: varchar("user_id").notNull(),

    storeType: varchar("store_type", {
      enum: storeTypesArray
    })
      .array()
      .notNull(),
    storeName: varchar("store_name").notNull(),
    storePhone: varchar("store_phone").notNull(),
    country: varchar("country", {
      enum: countriesArray
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

    monthlySubscriptionPaid: boolean("monthly_subscription_paid").default(
      false
    ),
    // subscriptionInfo: jsonb("subscriptionInfo"),
    localCardApiKeyId: uuid("local_card_api_key_id"),
    transactionId: uuid("transaction_id"),

    acceptingOrders: boolean("accepting_orders").default(false),
    includeLocalCardFeeToPrice: boolean(
      "include_local_card_fee_to_price"
    ).default(true),
    onlyStoreDriversCanTakeOrders: boolean(
      "only_store_drivers_can_take_orders"
    ).default(false),
    includeDeliveryFee: boolean("include_delivery_fee").default(false),
    deliverTo: varchar("deliver_to", { enum: citiesArray }).array(),
    deliverWithStoreDrivers: boolean("deliver_with_store_drivers").default(
      false
    )
  },
  (table) => {
    return {
      userIdx: uniqueIndex("store_user_idx").on(table.userId),
      usersIdsx: index("store_users_idsx").on(table.usersIds),
      latx: index("store_latx").on(table.lat),
      longx: index("store_longx").on(table.long),
      localCardApiKeyIdx: uniqueIndex("store_local_card_api_key_id").on(
        table.localCardApiKeyId
      )
    };
  }
);

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
      userType: z.string()
    })
  ),
  notificationTokens: z.nullable(z.array(z.string()))
});

// export type Store = z.infer<typeof zStore>;
