export const getOrderHistoryHandler = async ({ arg, client, db, userId }: MainFunctionProps) => {
  const { status, city, country, id, lastDoc } = arg[0];
  // const db = client.db('base');
  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', sql`ARRAY[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();
  const orders = await db
    .selectFrom('orders')
    .where('orders.storeId', '=', storeDoc.id)
    // .where(
    //   sql`${sql.raw(`${tOrders._}.${tOrders.orderStatus[0]._}[-1]`)} = ${'delivered'}::varchar`
    // )
    .innerJoin('stores', 'orders.storeId', 'stores.id')
    .innerJoin('orderProducts', 'orderId', 'orders.id')
    .selectAll('orders')
    .select(buildJson<tOrderProduct>(tOrderProducts, '*').as('addedProducts'))
    .select(
      buildJson<tStore>(tStores, [
        'storeName',
        'description',
        'lat',
        'long',
        'country',
        'image',
        'id',
        'opened',
        'storeType',
        'storePhone',
      ]).as('stores')
    )
    .groupBy('orders.id')
    .limit(15)
    .execute();

  return orders;
};
interface GetOrderHistoryProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}



import {
  MainFunctionProps,
  buildJson,
  mainWrapper,
  tOrderProduct,
  tOrderProducts,
  tOrders,
  tProducts,
  tStore,
  tStores,
} from 'hyfn-server';
import { sql } from 'kysely';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getOrderHistoryHandler });
};
