const { ObjectId } = require('mongodb');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ORDER_STATUS_READY, STORE_STATUS_PREPARING } from '../common/constants';
interface SetOrderAsReadyProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const setOrderAsReadyHandler = async ({ arg, client, userId }: SetOrderAsReadyProps) => {
  const { orderId, country } = arg[0];

  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ usersIds: userId }, {});
  if (!storeDoc) throw new Error('store not found');
  const storeId = storeDoc._id.toString();

  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) }, {});
  if (orderDoc.delivered) {
    throw new Error('order is Delivered');
  }
  const store = orderDoc.orders.find((store) => {
    return store._id.toString() === storeId;
  });
  if (!store.paid) {
    throw new Error('Not paid yet');
  }
  // if (store.orderStatus !== STORE_STATUS_PREPARING) {
  //   throw new Error('Not preparing');
  // }
  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          ['orders.$[store].orderStatus']: ORDER_STATUS_READY,
          // ['status.$[store].status']: ORDER_STATUS_READY,
        },
      },
      {
        arrayFilters: [{ 'store._id': new ObjectId(storeId) }],
      }
    );
  return 'success';
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setOrderAsReadyHandler });
};
