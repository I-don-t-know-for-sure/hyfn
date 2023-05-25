interface GetActiveOrdersProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');

import {
  MainFunctionProps,
  buildJson,
  mainWrapper,
  tOrderProduct,
  tOrderProducts,
  tStores,
} from 'hyfn-server';
import { sql } from 'kysely';
interface GetActiveOrdersProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const getActiveOrders = async ({ arg, client, db }: GetActiveOrdersProps) => {
  var result;

  const { customerId, status, country, lastDoc } = arg[0];

  const orders = await db
    .selectFrom('orders')
    .innerJoin('orderProducts', (join) => join.onRef('orders.id', '=', 'orderProducts.orderId'))
    .innerJoin('stores', (join) => join.onRef('orders.storeId', '=', 'stores.id'))
    .groupBy('stores.id')
    .select(buildJson(tStores, '*').as('stores'))
    .select(buildJson<tOrderProduct>(tOrderProducts, '*').as('addedProducts'))

    .selectAll('orders')
    .groupBy('orders.id')
    .limit(5)
    .execute();
  return orders;

  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getActiveOrders });
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
