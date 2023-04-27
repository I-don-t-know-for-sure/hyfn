export const setOrderAsDeliveredHandler = async ({ arg, client, userId }: MainFunctionProps) => {
  const { orderId, country } = arg[0];
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ usersIds: userId }, {});
  if (!storeDoc) throw new Error('store not found');
  const storeId = storeDoc._id.toString();
  console.log('🚀 ~ file: setOrderAsDelivered.js:10 ~ mainFunction ~ storeId', storeId);
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) }, {});
  const storeOrder = orderDoc.orders.find((store) => {
    return store._id.toString() === storeId;
  });
  console.log('🚀 ~ file: setOrderAsDelivered.js:21 ~ isStoreInOrder ~ status', orderDoc.status);
  console.log('🚀 ~ file: setOrderAsDelivered.js:21 ~ isStoreInOrder ~ isStoreInOrder', storeOrder);
  if (!storeOrder) {
    throw new Error('this store is not in the order');
  }
  if (!storeOrder.paid) {
    throw new Error('store not paid yet');
  }
  if (storeOrder.storeType.includes(STORE_TYPE_RESTAURANT)) {
    if (storeOrder.orderStatus !== STORE_STATUS_READY) {
      throw new Error('Not ready');
    }
  }
  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          ['status.$[store].status']: ORDER_STATUS_DELIVERED,
        },
      },
      {
        arrayFilters: [{ 'store._id': new ObjectId(storeId) }],
      }
    );
  return 'success';
};
interface SetOrderAsDeliveredProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
const { ObjectId } = require('mongodb');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import {
  STORE_STATUS_READY,
  ORDER_STATUS_DELIVERED,
  STORE_TYPE_RESTAURANT,
} from '../common/constants';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setOrderAsDeliveredHandler });
};
