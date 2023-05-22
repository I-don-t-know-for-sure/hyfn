interface FindOrdersProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, buildJson, mainWrapper, tStores } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { ORDER_TYPE_DELIVERY, COLLECTION, USER_TYPE_DRIVER } from 'hyfn-types';
import { sql } from 'kysely';
export const mainFunction = async ({ arg, client, event, db }: MainFunctionProps) => {
  console.log('🚀 ~ file: findOrders.ts:7 ~ COLLECTION:', COLLECTION);
  // await findOrderValidations(arg);
  console.log(event);
  const userCoords = arg[0];
  const { city, country, driverId, lastDoc } = arg[1];
  // the driver must be at most 2 kilos from the order to take it
  const orders = await db
    .selectFrom('orders')
    .innerJoin('stores', (join) => join.onRef('stores.id', '=', 'orders.storeId'))
    .selectAll('orders')
    .select(buildJson(tStores, '*').as('stores'))
    .groupBy('orders.id')
    .groupBy('stores.id')
    // .where(({ not, cmpr }) =>
    //   not(cmpr('driverStatus', '@>', sql`array[${sql.join(['set'])}]::varchar[]`))
    // )
    .limit(5)
    .execute();

  if (!orders) {
    return [];
  }

  return orders || [];

  // Ensures that the client will close when you finish/error
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction });
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
