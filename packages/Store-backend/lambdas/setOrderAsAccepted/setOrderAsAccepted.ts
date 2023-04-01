interface SetOrderAsAcceptedProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { orderSchema, USER_TYPE_DRIVER } from 'hyfn-types';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

import {
  ORDER_STATUS_ACCEPTED,
  STORE_STATUS_PENDING,
  PAYMENT_WINDOW,
  ORDER_TYPE_DELIVERY,
} from '../common/constants';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }: MainFunctionProps) => {
    const { orderId, country, storeId } = arg[0];
    type Order = z.infer<typeof orderSchema>;
    const orderDoc = await client
      .db('base')
      .collection('orders')
      .findOne({ _id: new ObjectId(orderId) }, { projection: {} });

    if (orderDoc.delivered) {
      throw new Error('order is Delivered');
    }
    const driverStatus = orderDoc.status.find((status) => {
      return status.userType === USER_TYPE_DRIVER && status._id !== '';
    });

    if (!driverStatus && orderDoc.orderType === ORDER_TYPE_DELIVERY) {
      throw new Error('This order has no driver');
    }

    const store = orderDoc.orders.find((store) => {
      return store._id.toString() === storeId;
    });

    if (store.orderStatus !== STORE_STATUS_PENDING) {
      throw new Error('Not pending');
    }
    const productNotPicked = store.addedProducts.find(
      (product) => product?.pickup?.pickedUp === undefined
    );
    if (productNotPicked) {
      throw new Error('one of the products not picked');
    }
    // if the order was canceled then we won't allow the driver to ask for payment
    if (orderDoc.canceled) {
      throw new Error('Order was canceled');
    }

    const now = new Date();
    now.setMinutes(now.getMinutes() + PAYMENT_WINDOW);

    await client
      .db('base')
      .collection<Order>('orders')
      .updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            ['orders.$[store].orderStatus']: ORDER_STATUS_ACCEPTED,
            ['orders.$[store].paymentWindowCloseAt']: now.toJSON(),
            // ['status.$[store].status']: ORDER_STATUS_ACCEPTED,
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
