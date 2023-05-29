export const setOrderAsDeliveredHandler = async ({
  arg,
  client,
  userId,
  db,
}: MainFunctionProps) => {
  const { orderId, country } = arg[0];

  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', sql`array[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();
  if (!storeDoc) throw new Error('store not found');
  const storeId = storeDoc.id.toString();

  const orderDoc = await db
    .selectFrom('orders')
    .selectAll()
    .where('id', '=', orderId)
    .executeTakeFirstOrThrow();

  // if (!storeOrder) {
  //   throw new Error(returnsObj["this store is not in the order"]);
  // }
  if (!orderDoc.storeStatus.includes('paid')) {
    throw new Error(returnsObj['store not ready yet']);
  }

  if (storeDoc.storeType.includes(STORE_TYPE_RESTAURANT)) {
    if (!orderDoc.storeStatus.includes('ready')) {
      throw new Error(returnsObj['Not ready']);
    }
  }

  await db
    .updateTable('orders')
    .set({
      storeStatus: [...orderDoc.storeStatus, 'pickedUp'],
    })
    .where('id', '=', orderId)
    .execute();
  return 'success';
};
interface SetOrderAsDeliveredProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
const { ObjectId } = require('mongodb');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { STORE_STATUS_READY, ORDER_STATUS_DELIVERED, STORE_TYPE_RESTAURANT } from 'hyfn-types';
import { sql } from 'kysely';
import { returnsObj } from 'hyfn-types';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setOrderAsDeliveredHandler });
};
