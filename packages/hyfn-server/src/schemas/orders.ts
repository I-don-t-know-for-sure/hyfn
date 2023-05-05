import {
  boolean,
  decimal,
  json,
  pgTable,
  serial,
  varchar,
  date,
} from "drizzle-orm/pg-core";
import { citiesArray } from "hyfn-types";

import { InferModel } from "drizzle-orm";
import { products } from "./products";

type Product = InferModel<typeof products, "select">;

export const orders = pgTable("orders", {
  _id: serial("_id").primaryKey(),

  userId: varchar("userId"),

  storeId: varchar("storeId"),
  storeStatus: json("storeStatus").$type<{
    _id: string;
    status: string;
    userType: string;
  }>(),
  customerStatus: json("customerStatus").$type<{
    _id: string;
    status: string;
    userType: string;
  }>(),
  driverStatus: json("driverStatus").$type<{
    _id: string;
    status: string;
    userType: string;
  }>(),
  StorePickupConfirmation: varchar("StorePickupConfirmation"),
  paymentWindowCloseAt: date("paymentWindowCloseAt"),
  addedProducts: json("addedProducts").$type<Product>().array(),
  buyerCoords: decimal("buyerCoords").array(),
  city: varchar("city", { enum: citiesArray as [string, ...string[]] }),
  orderCost: decimal("orderCost"),
  storeServiceFee: decimal("storeServiceFee"),
  deliveryFee: decimal("deliveryFee"),
  orderDate: date("orderDate").defaultNow(),
  deliveryDate: date("deliveryDate").defaultNow(),
  serviceFee: decimal("serviceFee"),
  serviceFeePaid: boolean("serviceFeePaid").default(false),
  orderType: varchar("orderType", { enum: ["Delivery", "Pickup"] }),
  proposals: json("proposals")
    .$type<{
      price: number;
      driverId: string;
      managementId: string;
    }>()
    .array(),
  coords: json("coords").$type<{
    type: "MultiPoint";
    coordinates: number[][];
  }>(),
  confirmationCode: varchar("confirmationCode"),
  proposalsIds: varchar("proposalsIds").array(),
  acceptedProposal: varchar("acceptedProposal"),
  driverManagement: varchar("driverManagement"),
  managementFee: decimal("managementFee"),
});
