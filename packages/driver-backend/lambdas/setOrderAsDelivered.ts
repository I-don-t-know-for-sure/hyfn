export const setOrderAsDeliveredHandler = async ({
  arg,
  client,
  db,
  userId,
}: MainFunctionProps) => {
  const result = await db.transaction().execute(async (trx) => {
    const { id, country, confirmationCode, orderId } = arg[0];
    console.log('🚀 ~ file: setOrderAsDelivered.js:20 ~ mainFunction ~ arg', arg[0]);

    const driverDoc = await trx
      .selectFrom('drivers')
      .selectAll()
      .where('userId', '=', userId)
      .executeTakeFirstOrThrow();

    // const driverTakenOrder = orderIds.find((id) => id === orderId);
    // if (!driverTakenOrder) {
    //   throw new Error('driver did not take the order');
    // }
    // if (!driverDoc?.onDuty) {
    //   throw new Error('driver is not on duty');
    // }

    const orderDoc = await trx
      .selectFrom('orders')
      .selectAll()
      .where('confirmationCode', '=', confirmationCode)
      .where('driverId', '=', id)
      .executeTakeFirstOrThrow();
    if (!orderDoc.storeStatus.includes('paid')) {
      throw new Error('not all stores are paid');
    }
    if (!orderDoc.deliveryFeePaid) throw new Error('delivery fee not paid');
    if (orderDoc.confirmationCode !== confirmationCode) {
      throw new Error('Confirmation Code does not match');
    }

    await trx
      .updateTable('orders')
      .set({
        deliveryDate: new Date(),

        orderStatus: [...orderDoc.orderStatus, 'delivered'],
        // maybe add a delivered status to both the driver and customer
      })
      .where('confirmationCode', '=', confirmationCode)
      .execute();

    const removeDriverAfterOrder = driverDoc.removeDriverAfterOrder;
    if (removeDriverAfterOrder) {
      const hasOrders = await trx
        .selectFrom('orders')
        .select('id')
        .where('driverId', '=', driverDoc.id)
        .where(sql`not array_contains(order_status, ${'delivered'})`)
        .execute();
      if (hasOrders.length === 0) {
        await trx
          .updateTable('drivers')
          .set({
            driverManagement: undefined,
            removeDriverAfterOrder: false,
          })
          .where('id', '=', driverDoc.id)
          .executeTakeFirst();
      }

      await trx
        .updateTable('driverManagements')
        .set({
          profits: sql`profits + ${orderDoc.deliveryFee}`,
        })
        .where('id', '=', orderDoc.driverManagement)
        .execute();
      return 'success';
    }

    await trx
      .updateTable('driverManagements')
      .set({
        profits: sql`profits + ${orderDoc.deliveryFee}`,
      })
      .where('id', '=', orderDoc.driverManagement)
      .execute();

    return 'success';
  });

  return result;
};
interface SetOrderAsDeliveredProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');

import { MainFunctionProps, mainWrapper, tOrder } from 'hyfn-server';
import { sql } from 'kysely';
export const handler = async (event) => {
  return await mainWrapper({
    mainFunction: setOrderAsDeliveredHandler,
    event,
  });
};
