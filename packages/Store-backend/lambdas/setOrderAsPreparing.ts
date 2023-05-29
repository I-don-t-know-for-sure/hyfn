import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ORDER_STATUS_PREPARING } from 'hyfn-types';
import { sql } from 'kysely';
import { returnsObj } from 'hyfn-types';
interface SetOrderAsPreparingProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const setOrderAsPreparingHandler = async ({
  arg,
  client,
  userId,
  db,
}: SetOrderAsPreparingProps) => {
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
  if (orderDoc.orderStatus.includes('delivered')) {
    throw new Error(returnsObj['order is Delivered']);
  }

  if (!orderDoc.storeStatus.includes('paid')) {
    throw new Error(`current state is ${orderDoc.storeStatus}`);
  }

  // await client
  //   .db('base')
  //   .collection('orders')
  //   .updateOne(
  //     { id: new ObjectId(orderId) },
  //     {
  //       $set: {
  //         ['orders.$[store].orderStatus']: ORDER_STATUS_PREPARING,
  //         ['status.$[store].status']: ORDER_STATUS_PREPARING,
  //       },
  //     },
  //     {
  //       arrayFilters: [{ 'store.id': new ObjectId(storeId) }],
  //     }
  //   );

  await db
    .updateTable('orders')
    .set({
      storeStatus: [...orderDoc.storeStatus, 'preparing'],
    })
    .where('id', '=', orderId)
    .execute();
  return 'success';
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setOrderAsPreparingHandler });
};
