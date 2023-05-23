('use strict');
import { mainWrapper, MainFunctionProps, tOrderProducts } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { USER_TYPE_STORE, STORE_STATUS_PENDING, STORE_STATUS_ACCEPTED } from 'hyfn-types';
import { sql } from 'kysely';
interface SetProductAsNotFoundProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const setProductAsNotFoundHandler = async ({
  arg,
  client,
  userId,
  db,
}: MainFunctionProps) => {
  var result;
  const { productId, orderId } = arg[0];
  // const {id: storeId, country } = await client
  //   .db('generalData')
  //   .collection('storeInfo')
  //   .findOne({ userId }, { projection: {id: 1, country: 1 } });

  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', sql`array[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirst();

  const orderDoc = await db
    .selectFrom('orders')
    .selectAll()
    .where('id', '=', orderId)
    .executeTakeFirstOrThrow();
  const orderProduct = await db
    .selectFrom('orderProducts')
    .selectAll()
    .where('orderId', '=', orderDoc.id)
    .executeTakeFirstOrThrow();
  if (
    orderDoc.storeStatus.includes('accepted')
    // storeOrder.orderStatus !== STORE_STATUS_ACCEPTED
  ) {
    throw new Error('can not edit order products after being accepted');
  }

  await db
    .updateTable('orderProducts')
    .set({
      pickupStatus: [
        ...(orderProduct?.pickupStatus.filter((status) => status !== 'pickedUp') || []),
        'notFound',
      ],
    })
    .where('id', '=', productId)
    .where('orderId', '=', orderId)
    .execute();
  result = 'success';
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setProductAsNotFoundHandler });
};
