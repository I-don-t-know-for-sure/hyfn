interface ReportOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}

import { MainFunctionProps, mainWrapper, tDrivers } from 'hyfn-server';
import { sql } from 'kysely';
export const reportOrderHandler = async ({ arg, client, db, userId }: MainFunctionProps) => {
  const result = await db.transaction().execute(async (trx) => {
    const { report, orderId, country } = arg[0];
    const customerDoc = await trx
      .selectFrom('customers')
      .select('id')
      .where('userId', '=', userId)
      .executeTakeFirstOrThrow();
    const orderDoc = await trx
      .selectFrom('orders')
      .selectAll()
      .where('id', '=', orderId)
      .where('customerId', '=', customerDoc.id)
      .executeTakeFirst();

    // TODO: check the userId of the user who called this function and see
    // if it doesn't match with the userId in the orderDoc then throw
    if (orderDoc.orderStatus[orderDoc.orderStatus.length - 1] === 'delivered') {
      throw new Error('order is already delivered');
    }
    const orderType = orderDoc.orderType;

    if (!orderDoc.serviceFeePaid) {
      throw new Error(
        'service fee not paid, can`t report an order when the service fee is not paid'
      );
    }
    const driverId = orderDoc.driverId;

    const reportDoc = await trx
      .insertInto('reports')
      .values({
        driverId: driverId,
        orderId,
        reportDate: new Date(),
      })
      .returning('id')
      .executeTakeFirst();

    await trx
      .updateTable('drivers')
      .set({
        reportsIds: sql`${sql.raw(tDrivers.reportsIds)} || ${[reportDoc.id]}`,
      })
      .where('id', '=', driverId)
      .executeTakeFirst();

    await trx
      .updateTable('customers')
      .set({
        reportsIds: sql`${sql.raw(tDrivers.reportsIds)} || ${[reportDoc.id]}`,
      })
      .where('id', '=', orderDoc.customerId)
      .executeTakeFirst();

    await trx
      .updateTable('orders')
      .set({
        reportsIds: sql`${sql.raw(tDrivers.reportsIds)} || ${[reportDoc.id]}`,
      })
      .where('id', '=', orderDoc.id)
      .executeTakeFirst();
  });

  return result;
  //  if(orderType === ORDER_TYPE_PICKUP){
  //  }
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: reportOrderHandler });
};
