export const getActiveOrdersHandler = async ({ arg, client, db, userId }: MainFunctionProps) => {
  const { id, lastDoc } = arg[0];
  const store = await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', sql`array[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();
  const orders = await db
    .selectFrom('orders')

    .innerJoin('orderProducts', (join) => join.onRef('orderProducts.orderId', '=', 'orders.id'))
    .groupBy('orders.id')
    .select(buildJson(tOrderProducts, '*').as('addedProducts'))

    .selectAll('orders')
    .limit(5)
    .where('orders.storeId', '=', store.id)
    .where('orders.deliveryFee', '>=', 0)
    .execute();
  const mappedOrders = orders.map((order) => ({ ...order, stores: [store] }));
  return mappedOrders;
};
interface GetActiveOrdersProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { ObjectId } from 'mongodb';
import {
  ORDER_STATUS_DELIVERED,
  ORDER_TYPE_PICKUP,
  USER_TYPE_DRIVER,
  USER_TYPE_STORE,
} from 'hyfn-types';
import {
  MainFunctionProps,
  buildJson,
  mainWrapper,
  tOrderProducts,
  tOrders,
  tStores,
} from 'hyfn-server';
import { sql } from 'kysely';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getActiveOrdersHandler });
};
