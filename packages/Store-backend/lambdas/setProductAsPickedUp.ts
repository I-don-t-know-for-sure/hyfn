import { mainWrapper, MainFunctionProps, tOrderProducts } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { STORE_STATUS_ACCEPTED, STORE_STATUS_PENDING, USER_TYPE_STORE } from 'hyfn-types';
import { sql } from 'kysely';
import { returnsObj } from 'hyfn-types';
interface SetProductAsPickedUpProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const setProductAsPickedUpHandler = async ({
  arg,
  client,
  userId,
  db,
}: SetProductAsPickedUpProps) => {
  var result;
  const { QTYFound, productId, orderId } = arg[0];
  // const {id, country } = await client
  //   .db('generalData')
  //   .collection('storeInfo')
  //   .findOne({ userId }, { projection: {id: 1, country: 1 } });
  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', sql`array[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();

  if (!storeDoc) throw new Error('store not found');

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
        ...(orderProduct?.pickupStatus.filter((status) => status !== 'notFound') || []),
        'pickedUp',
      ],
      qtyFound: QTYFound,
    })
    .where('id', '=', productId)
    .where('orderId', '=', orderId)
    .execute();
  result = 'success';
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setProductAsPickedUpHandler });
};
