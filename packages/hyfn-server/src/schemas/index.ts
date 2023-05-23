import { zCollection, collections } from "./collections";
import { zDriverManagement, driverManagements } from "./driverManagements";
import { zDriver, drivers } from "./drivers";
import { zLocalCardKeys } from "./localCardKeys";
import { zOrder, orders } from "./orders";
import { zProduct, products } from "./products";
import { zStore, stores } from "./stores";
import { zTransaction, transactions } from "./transactions";
import { zCustomer } from "./customers";
import * as z from "zod";
export * from "./customers";
export * from "./driverManagements";
export * from "./localCardKeys";
export * from "./orders";
export * from "./products";
export * from "./stores";
export * from "./transactions";
export * from "./drivers";
export * from "./collections";

import { ZodArray, ZodObject, ZodType } from "zod";
import { v4 as uuidv4 } from "uuid";
import { zCollectionsProducts } from "./collections_products";

import { zLocalCardKeyStoreActivity } from "./localCardKey_store_activity";
import { zOrderProducts } from "./orderProducts";

import { zReports } from "./reports";
import { sql } from "kysely";

type ZodSchemaObject = Record<string, ZodType<any, any>>;

type ZodSchemaResultObject<T extends ZodSchemaObject> = {
  [K in keyof T]: T[K] extends ZodObject<any, any>
    ? { _: K } & ZodSchemaResultObject<T[K]["shape"]>
    : T[K] extends ZodArray<infer U>
    ? U extends ZodObject<any, any>
      ? { _: K } & ZodSchemaResultObject<U["shape"]>[]
      : Array<{ _: K }>
    : K;
};
export function reorderKeysAlphabetically(arr: any[], columns: string[]) {
  // Define a helper function to reorder the keys for a single object
  const keys = { ...columns };
  keys.sort();
  function reorderObjectKeys(obj: any) {
    const ordered: any = {};
    keys.forEach(function (key) {
      ordered[key] = obj[key];
    });
    return ordered;
  }

  // Map over the input array and reorder the keys for each object
  const orderedArr = arr.map((obj) => reorderObjectKeys(obj));

  // Return the values of the reordered objects in an array
  return orderedArr.map((obj) => Object.values(obj));
}
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase());

  // .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function zodSchemaToObject<T extends ZodSchemaObject>(
  schema: ZodObject<T>
): ZodSchemaResultObject<T> {
  const shape = schema.shape;
  const result: any = {};
  for (const key in shape) {
    const field = shape[key];
    const snakeKey = toSnakeCase(key);
    if (field instanceof ZodObject) {
      result[key] = { _: snakeKey, ...zodSchemaToObject(field) };
    } else if (field instanceof ZodArray) {
      if (field.element instanceof ZodObject) {
        result[key] = [{ _: snakeKey, ...zodSchemaToObject(field.element) }];
        result[key]._ = snakeKey;
      } else {
        result[key] = [{ _: snakeKey }];
      }
    } else {
      result[key] = snakeKey;
    }
  }
  return result;
}
// not safe
export const getJson = (table: string, shape: any) => {
  var str = ``;
  const keys = Object.keys(shape);
  for (const key of keys) {
    str = str + `'${key}', ${table}.${shape[key]},`;
  }
  str = str.slice(0, -1);

  return `jsonb_build_object(${str})`;
};
// not safe
export function getJson2<T>(table: string, shape: any) {
  var str = ``;
  const keys = Object.keys(shape);
  for (const key of keys) {
    str = str + `'${key}', ${table}.${shape[key]},`;
  }
  str = str.slice(0, -1);

  return sql.raw<T>(`jsonb_agg(jsonb_build_object(${str}))`);
}
// not safe so dont use values from the users
export function buildJson<T extends Object>(
  table: any,
  shape: "*" | Array<keyof T>
) {
  if (typeof shape === "string") {
    return sql.raw<T[]>(`jsonb_agg(${table._}.*)`);
  }
  var str = ``;
  const keys = shape;
  for (const key of keys) {
    str = str + `'${String(key)}', ${table._ as any}.${table[String(key)]},`;
  }
  str = str.slice(0, -1);

  return sql.raw<T[]>(`jsonb_agg(jsonb_build_object(${str}))`);
}

// replace(/[A-Z]/g, (match) => "_" + match.toLowerCase()
/* function zodSchemaToObject<T extends ZodSchemaObject>(
  schema: ZodObject<T>
): ZodSchemaResultObject<T> {
  const shape = schema.shape;
  const result: any = {};
  for (const key in shape) {
    const field = shape[key];
    if (field instanceof ZodObject) {
      result[key] = { _: key, ...zodSchemaToObject(field) };
    } else if (field instanceof ZodArray) {
      if (field.element instanceof ZodObject) {
        result[key] = [{ _: key, ...zodSchemaToObject(field.element) }];
        result[key]._ = key;
      } else {
        result[key] = [{ _: key }];
      }
    } else {
      result[key] = key;
    }
  }
  return result;
} */

export const updateJsonColumn = (obj: any, column: string) => {
  const keys = Object.keys(obj);
  const firstKey = keys.pop();
  if (!firstKey) {
    return;
  }
  var res = `jsonb_set(${column}, '{${firstKey.split(".").join(",")}}', ${
    typeof obj[firstKey] === "string" ? `"${obj[firstKey]}"` : obj[firstKey]
  })`;
  keys.forEach((key) => {
    res = `jsonb_set(${res}, '{${key.split(".").join(",")}}', ${
      typeof obj[key] === "string" ? `"${obj[key]}"` : obj[key]
    })`;
  });
  console.log(res);
  return `jsonb_strip_nulls(${res})`;
};

// const takeFisrtOrThrow = () => {

// }
export function takeFisrtOrThrow<T extends z.ZodType<any>>(
  schema: T,
  value: z.infer<T>,
  error?: string
): z.infer<T> {
  const rows = value.rows;
  if (!rows) {
    throw new Error(error || "no value");
  }
  if (Array.isArray(rows)) {
    if (rows.length === 0) {
      throw new Error(error || "no value");
    }
  }
  if (Array.isArray(rows)) {
    const row: any = rows[0];
    const parsedValue = schema.parse(row);
    console.log("🚀 ~ file: index.ts:146 ~ value:", parsedValue);
    return parsedValue;
  }
  // const parsedValue = schema.parse(value);
  // return parsedValue;
}

export function takeFisrt<T extends z.ZodType<any>>(
  schema: T,
  value: z.infer<T>
): z.infer<T> {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return undefined;
    }
  }
  if (Array.isArray(value)) {
    const parsedValue = schema.parse(value[0]);
    return parsedValue;
  }
  const parsedValue = schema.parse(value);
  return parsedValue;
}

export function takeMany<T extends z.ZodType<any>>(
  schema: T,
  value: z.infer<T>
): z.infer<T>[] {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [];
    }
  }

  const parsedValue = z.array(schema).parse(value);
  return parsedValue;
}

/* 
To make a bulk update to multiple rows with different ways to handle the `jsonb_agg` function based on the row, you can use a `CASE` statement inside the `jsonb_agg` function. Here's an example query:

```
UPDATE my_table
SET my_array_column = (
  SELECT jsonb_agg(
           CASE 
             WHEN id = 1 THEN jsonb_set(jsonb_element, '{path1}', '{"new_value": "updated1"}')
             WHEN id = 2 THEN jsonb_set(jsonb_element, '{path2}', '{"new_value": "updated2"}')
             ELSE jsonb_element
           END
         ) FILTER (WHERE jsonb_agg IS NOT NULL)
  FROM (
    SELECT id, jsonb_array_elements(my_array_column) AS jsonb_element
    FROM my_table
    WHERE id IN (1, 2, 3) -- replace with your list of ids
  ) AS subquery
  WHERE subquery.id = my_table.id
)
WHERE id IN (1, 2, 3); -- replace with your list of ids
```
or 

````````
UPDATE my_table
SET my_array_column = (
  SELECT jsonb_agg(
           CASE 
             WHEN id = 1 THEN jsonb_set(jsonb_element, '{path1}', '{"new_value": "updated1"}')
             WHEN id = 2 THEN jsonb_set(jsonb_element, '{path2}', '{"new_value": "updated2"}')
             ELSE jsonb_element
           END
         ) FILTER (WHERE jsonb_agg IS NOT NULL)
  FROM (
    SELECT id, jsonb_array_elements(my_array_column) AS jsonb_element
    FROM my_table
    WHERE id IN (1, 2, 3) -- replace with your list of ids
  ) AS subquery
  WHERE subquery.id = my_table.id
)
WHERE id IN (1, 2, 3); -- replace with your list of ids

````````


In this query, we use the `CASE` statement inside the `jsonb_agg` function to handle the JSON aggregation differently based on the value of the `id` column. For example, if the `id` is 1, we update the JSON element using the `jsonb_set` function with the `path1` path; if the `id` is 2, we update the JSON element with the `path2` path; otherwise, we leave the JSON element unchanged.

After applying the `CASE` statement, we filter out any `NULL` values using the `FILTER (WHERE ...)` clause, since the `jsonb_set` function may return `NULL` if the specified `path` does not exist in the JSON element.

We then aggregate the updated JSON elements back into an array using `jsonb_agg`, and assign the resulting array to the `my_array_column` column for all the rows with the specified `id` values.

Note that we also join the subquery with the outer query using the `WHERE subquery.id = my_table.id` clause to ensure that the updated JSON array is associated with the correct row.
*/

// read above to make the bulk update update arrays and json
// remember that to update something to null you must set null otherwise this function will skip the value and it wont be updated in the database
export const bulkUpdate = (
  arr: { filter: string; update: any }[],
  columns: string[]
) => {
  var res: any = {};
  for (const column of columns) {
    const whenClauses = [];
    for (const row of arr) {
      if (row.update[column] === undefined) {
        continue;
      }
      whenClauses.push(
        `when ${row.filter} then ${
          typeof row.update[column] === "string"
            ? `'${row.update[column]}'`
            : row.update[column]
        }`
      );
    }
    if (whenClauses.length > 0) {
      res[column] = column;
    }
    res[column] = `case \n ${whenClauses.join("\n")} \n else ${column} \n end`;
  }
  return res;
};
/* export const bulkUpdate = (arr: { filter: string; update: any }[]) => {
  var columns: any = [];

  for (const row of arr) {
    const keys = Object.keys(row.update);
    keys.map((key) => {
      if (!columns.includes(key)) {
        columns.push(key);
      }
    });
  }
  var res: any = {};
  for (const column of columns) {
    const whenClauses = [];
    for (const row of arr) {
      if (row.update[column] === undefined) {
        continue;
      }
      whenClauses.push(`when ${row.filter} then ${row.update[column]}`);
    }
    res[column] = `case \n ${whenClauses.join("\n")} \n else ${column} \n end`;
  }
  return res;
}; */

export type tCollection = z.infer<typeof zCollection>;
export type tDriver = z.infer<typeof zDriver>;
export type tDriverManagement = z.infer<typeof zDriverManagement>;
export type tLocalCardKey = z.infer<typeof zLocalCardKeys>;
export type tOrder = z.infer<typeof zOrder>;
export type tStore = z.infer<typeof zStore>;
export type tProduct = z.infer<typeof zProduct>;
export type tTransaction = z.infer<typeof zTransaction>;
export type tCustomer = z.infer<typeof zCustomer>;
export type tCollectionsProduct = z.infer<typeof zCollectionsProducts>;

export type tLocalCardKeyStoreActivity = z.infer<
  typeof zLocalCardKeyStoreActivity
>;
export type tReport = z.infer<typeof zReports>;
export type tOrderProduct = z.infer<typeof zOrderProducts>;

export type Database = {
  reports: tReport;
  collections: tCollection;
  drivers: tDriver;
  driverManagements: tDriverManagement;
  localCardKeys: tLocalCardKey;
  orders: tOrder;
  products: tProduct;
  stores: tStore;
  transactions: tTransaction;
  customers: tCustomer;
  collectionsProducts: tCollectionsProduct;

  localCardKeyStoreActivity: tLocalCardKeyStoreActivity;
  orderProducts: tOrderProduct;
};

export const tCollections = {
  _: "collections" as const,
  ...zodSchemaToObject(zCollection),
};
export const tDrivers = {
  _: "drivers" as const,
  ...zodSchemaToObject(zDriver),
};
export const tDriverManagements = {
  _: toSnakeCase("driverManagements"),
  ...zodSchemaToObject(zDriverManagement),
};
export const tLocalCardKeys = {
  _: toSnakeCase("localCardKeys"),
  ...zodSchemaToObject(zLocalCardKeys),
};
export const tOrders = {
  _: "orders" as const,
  ...zodSchemaToObject(zOrder),
};
export const tOrderProducts = {
  _: "order_products",
  ...zodSchemaToObject(zOrderProducts),
};
export const tProducts = {
  _: "products" as const,
  ...zodSchemaToObject(zProduct),
};
export const tStores = {
  _: "stores" as const,
  ...zodSchemaToObject(zStore),
};
export const tTransactions = {
  _: "transactions" as const,
  ...zodSchemaToObject(zTransaction),
};
export const tCustomers = {
  _: "customers" as const,
  ...zodSchemaToObject(zCustomer),
};

export const tCollections_products = {
  _: toSnakeCase("collectionsProducts"),
  ...zodSchemaToObject(zCollectionsProducts),
};

////////////////////
