export const getActiveOrdersHandler = async ({
  arg,
  client,
  db,
  userId
}: MainFunctionProps) => {
  const store = await db
    .selectFrom("stores")
    .selectAll()
    .where("usersIds", "@>", sql`array[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();
  const orders = await db
    .selectFrom("orders")

    .innerJoin("orderProducts", (join) =>
      join.onRef("orderProducts.orderId", "=", "orders.id")
    )
    .groupBy("orders.id")
    .select(buildJson(tOrderProducts, "*").as("addedProducts"))

    .selectAll("orders")
    .limit(5)
    .where("orders.storeId", "=", store.id)
    .where(
      sql`${sql.raw(`${tOrders.storeStatus[0]._}[-1]`)} = ${
        storeStatusObject.pending
      }`
    )
    .execute();
  const mappedOrders = orders.map((order) => ({ ...order, stores: [store] }));
  return mappedOrders;
};
interface GetActiveOrdersProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");

import {
  MainFunctionProps,
  buildJson,
  mainWrapper,
  tOrderProducts,
  tOrders
} from "hyfn-server";
import { storeStatusObject } from "hyfn-types";
import { sql } from "kysely";
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: getActiveOrdersHandler
  });
};
