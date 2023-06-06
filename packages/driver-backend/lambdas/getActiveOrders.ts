('use strict');
import {
  MainFunctionProps,
  buildJson,
  mainWrapper,
  tOrderProduct,
  tOrderProducts,
  tStore,
  tStores,
} from 'hyfn-server';

interface GetActiveOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const getActiveOrderHandler = async ({ arg, client, db, userId }: MainFunctionProps) => {
  var result;
  const { driverId, orderId, country, lastDoc } = arg[0];

  const driver = await db
    .selectFrom('drivers')
    .select('id')
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  const orders = await db
    .selectFrom('orders')
    .innerJoin('orderProducts', 'orderProducts.orderId', 'orders.id')
    .innerJoin('stores', 'stores.id', 'orders.storeId')
    .selectAll('orders')
    .select(buildJson<tOrderProduct>(tOrderProducts, '*').as('addedProducts'))
    .select(buildJson<tStore>(tStores, '*').as('stores'))
    .where('orders.driverId', '=', driver.id)
    // .where(sql`${tOrders.orderStatus}[-1] <> all (array[${sql.join(['delivered', 'canceled'])}])`)

    .groupBy('orders.id')
    .limit(5)
    .execute();

  return orders;
};
// import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getActiveOrderHandler });
};
