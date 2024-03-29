('use strict');
import { mainWrapper, MainFunctionProps, tOrderProducts } from 'hyfn-server';


import { sql } from 'kysely';
import { returnsObj } from 'hyfn-types';
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
    throw new Error(returnsObj['can not edit order products after being accepted']);
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
