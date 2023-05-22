export const setOrderAsAcceptedHandler = async ({ arg, client, db }: MainFunctionProps) => {
  const { orderId, country, storeId } = arg[0];
  type Order = z.infer<typeof orderSchema>;

  const orderDoc = await db
    .selectFrom('orders')
    .selectAll()
    .where('id', '=', orderId)
    .executeTakeFirstOrThrow();

  const products = await db
    .selectFrom('orderProducts')
    .selectAll()
    .where('orderId', '=', orderId)
    .execute();
  if (orderDoc?.orderStatus?.includes('delivered')) {
    throw new Error('order is Delivered');
  }

  const driverStatus = orderDoc.driverStatus;

  if (!driverStatus.includes('set') && orderDoc.orderType === 'Delivery') {
    throw new Error('This order has no driver');
  }

  if (orderDoc.storeStatus.includes('accepted')) {
    throw new Error('already accepted');
  }
  const productNotPicked = products.find(
    (product) => product?.pickupStatus[product?.pickupStatus.length - 1] === 'initial'
  );
  if (productNotPicked) {
    throw new Error('one of the products not picked');
  }
  // if the order was canceled then we won't allow the driver to ask for payment
  if (orderDoc?.orderStatus?.includes('Canceled')) {
    throw new Error('Order was canceled');
  }
  const now = new Date();
  now.setMinutes(now.getMinutes() + PAYMENT_WINDOW);

  await db
    .updateTable('orders')
    .set({
      storeStatus: [...orderDoc.storeStatus, 'accepted'],
      paymentWindowCloseAt: now.toJSON(),
    })
    .where('id', '=', orderId)
    .executeTakeFirstOrThrow();
  return 'success';
};
interface SetOrderAsAcceptedProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
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
} from 'hyfn-types';
import { test } from 'node:test';
import { sql } from 'kysely';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setOrderAsAcceptedHandler });
};
