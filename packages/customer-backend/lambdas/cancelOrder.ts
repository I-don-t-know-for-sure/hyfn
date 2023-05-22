interface CancelOrderProps extends Omit<MainFunctionProps, 'arg'> {}
import { ObjectId } from 'mongodb';
import {
  ORDER_STATUS_PREPARING,
  ORDER_STATUS_READY,
  ORDER_TYPE_DELIVERY,
  ORDER_TYPE_PICKUP,
  USER_TYPE_DRIVER,
} from 'hyfn-types';
import { findOne, mainWrapper, updateOne, MainFunctionProps, withTransaction } from 'hyfn-server';

interface CancelOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const cancelOrder = async ({ arg, client, userId, db }: CancelOrderProps) => {
  const result = await db.transaction().execute(async (trx) => {
    const userDocument = await trx
      .selectFrom('customers')
      .selectAll()
      .where('userId', '=', userId)
      .executeTakeFirstOrThrow();
    const { orderId, country } = arg[0];
    if (!userDocument) {
      throw new Error('document not found');
    }

    const orderDoc = await trx
      .selectFrom('orders')
      .selectAll()
      .where('id', '=', orderId)
      .executeTakeFirstOrThrow();

    if (!orderDoc) {
      throw new Error('j');
    }

    if (orderDoc.customerId !== userDocument.id) {
      throw new Error('this user did not make this order');
    }
    // check if the order is already delivered
    if (orderDoc.orderStatus.includes('delivered')) {
      throw new Error('Order already delivered');
    }

    // check if the customer paid any store. if so then they can not cancel the order

    if (orderDoc.storeStatus.includes('paid')) {
      throw new Error('order has paid store');
    }
    // check if any of the stores orders are being prepared or already prepared

    if (orderDoc.orderStatus.includes('reporeted')) {
      throw new Error('this order is blocked because it`s reported');
    }

    const orderType = orderDoc.orderType;
    if (orderType === ORDER_TYPE_PICKUP) {
      await trx
        .updateTable('orders')
        .set({
          orderStatus: [...orderDoc.orderStatus, 'Canceled'],
        })
        .where('id', '=', orderId)
        .execute();
      return 'success';
    }
    if (orderType === ORDER_TYPE_DELIVERY) {
      await trx
        .updateTable('orders')
        .set({
          orderStatus: [...orderDoc.orderStatus, 'Canceled'],
        })
        .where('id', '=', orderId)
        .execute();
      return 'success';
    }
  });

  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: cancelOrder });
};
