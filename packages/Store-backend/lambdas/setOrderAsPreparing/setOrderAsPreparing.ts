const { ObjectId } = require('mongodb');

import { mainWrapper } from 'hyfn-server';
import { ORDER_STATUS_PREPARING, STORE_STATUS_ACCEPTED, STORE_STATUS_PAID } from '../resources';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    const { orderId, country, storeId } = arg[0];
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
    if (store.orderStatus !== STORE_STATUS_PAID) {
      throw new Error('Not accepted');
    }
    await client
      .db('base')
      .collection('orders')
      .updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            ['orders.$[store].orderStatus']: ORDER_STATUS_PREPARING,
            // ['status.$[store].status']: ORDER_STATUS_PREPARING,
          },
        },
        {
          arrayFilters: [{ 'store._id': new ObjectId(storeId) }],
        }
      );
    return 'success';
  };

  return await mainWrapper({ event, mainFunction });
};
