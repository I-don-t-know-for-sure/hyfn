import { boolean, json, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { citiesArray } from "hyfn-types";

type TextInfo = {
  title: string;
  description: string;
};

type Option = {
  hasOptions: boolean;
  options: {};
};
type Collection = {
  label: string;
  value: string;
};
type Pricing = {
  pricing: string;
  currency: "LYD";
  prevPrice: string;
};

export const products = pgTable("products", {
  _id: serial("_id").primaryKey(),
  textInfo: json("textInfo").$type<TextInfo>(),
  pricing: json("pricing").$type<Pricing>(),
  options: json("options").$type<Option>().array(),
  measurementSystem: varchar("measurementSystem", { enum: [""] }),
  collections: json("collections").$type<Collection>().array(),
  collectionsIds: varchar("collectionsIds").array(),
  isActive: boolean("isActive").default(false),
  storeId: varchar("storeId"),
  images: varchar("images").array(),
  city: varchar("city", { enum: citiesArray as [string, ...string[]] }),
});
