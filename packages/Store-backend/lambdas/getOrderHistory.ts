export const getOrderHistoryHandler = async ({ arg, client, db, userId }: MainFunctionProps) => {
  const { status, city, country, id, lastDoc } = arg[0];
  // const db = client.db('base');
  const storeDoc = await db
    .selectFrom('stores')
    .where('usersIds', '@>', [userId])
    .select(['id'])
    .executeTakeFirstOrThrow();
  const orders = await db
    .selectFrom('orders')
    .where('storeId', '=', storeDoc.id)
    .innerJoin('orderProducts', 'orderId', 'orders.id')
    .limit(15)
    .execute();

  return orders;
};
interface GetOrderHistoryProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { ObjectId } from 'mongodb';
import { ORDER_STATUS_DELIVERED } from 'hyfn-types';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getOrderHistoryHandler });
};
