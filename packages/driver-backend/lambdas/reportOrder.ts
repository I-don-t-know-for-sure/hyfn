export const reportOrderHandler = async ({ arg, client, db }: MainFunctionProps) => {
  const result = await db.transaction().execute(async (trx) => {
    const { report, orderId, country } = arg[0];

    const orderDoc = await trx
      .selectFrom('orders')
      .selectAll()
      .where('id', '=', orderId)
      .executeTakeFirstOrThrow();
    // TODO: check the userId of the user who called this function and see
    // if it doesn't match with the userId in the orderDoc then throw
    if (orderDoc.orderStatus.includes('delivered')) {
      throw new Error('order is already delivered');
    }
    const orderType = orderDoc.orderType;
    if (orderType === ORDER_TYPE_DELIVERY) {
      if (!orderDoc.serviceFeePaid) {
        throw new Error(
          'service fee not paid, can`t report an order when the service fee is not paid'
        );
      }
      const report = await trx
        .insertInto('reports')
        .values({
          reportDate: new Date().toDateString(),
          orderId,
          driverId: orderDoc.driverId,
        })
        .returning('id')
        .executeTakeFirst();

      await trx
        .updateTable('drivers')
        .set({
          reportsIds: sql`reportsids || ${report.id}`,
        })
        .execute();

      await trx
        .updateTable('customers')
        .set({
          reportsIds: sql`reportsids || ${report.id}`,
        })
        .where('id', '=', orderDoc.customerId)
        .executeTakeFirst();

      await trx
        .updateTable('orders')
        .set({
          reportsIds: sql`reportsids || ${report.id}`,
        })
        .where('id', '=', orderId)
        .executeTakeFirst();
    }
  });

  return result;
  //  if(orderType === ORDER_TYPE_PICKUP){
  //  }
};
interface ReportOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import { ORDER_TYPE_DELIVERY, ORDER_TYPE_PICKUP } from 'hyfn-types';
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
import { sql } from 'kysely';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: reportOrderHandler });
};
