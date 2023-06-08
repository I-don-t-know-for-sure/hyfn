const { ObjectId } = require('mongodb');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

import { sql } from 'kysely';
import { returnsObj } from 'hyfn-types';
interface SetOrderAsReadyProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const setOrderAsReadyHandler = async ({ arg, client, userId, db }: SetOrderAsReadyProps) => {
  const { orderId, country } = arg[0];

  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', sql`array[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();

  const storeId = storeDoc.id.toString();

  const orderDoc = await db
    .selectFrom('orders')
    .selectAll()
    .where('id', '=', orderId)
    .executeTakeFirstOrThrow();
  if (orderDoc.orderStatus.includes('delivered')) {
    throw new Error('order is Delivered');
  }

  if (!orderDoc.storeStatus.includes('paid')) {
    throw new Error(returnsObj['the must be in preparing state fisrt']);
  }
  // if (store.orderStatus !== STORE_STATUS_PREPARING) {
  //   throw new Error(returnsObj["Not preparing"]);
  // }

  await db
    .updateTable('orders')
    .set({
      storeStatus: [...orderDoc.storeStatus, 'ready'],
    })
    .where('id', '=', orderId)
    .execute();
  return 'success';
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setOrderAsReadyHandler });
};
