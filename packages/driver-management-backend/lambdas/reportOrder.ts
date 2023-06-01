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

      const reportDoc = await trx
        .insertInto('reports')
        .values({
          orderId,
          reportDate: new Date(),
          driverId: orderDoc.driverId,
        })
        .returning('id')
        .executeTakeFirst();
      const driverId = orderDoc.driverId;

      await trx
        .updateTable('drivers')
        .set({
          reportsIds: sql`reportsids || ${reportDoc.id}`,
        })
        .where('id', '=', orderDoc.driverId)
        .executeTakeFirst();

      await trx
        .updateTable('customers')
        .set({
          reportsIds: sql`reportsids || ${reportDoc.id}`,
        })
        .where('id', '=', orderDoc.customerId)
        .executeTakeFirst();

      await trx
        .updateTable('orders')
        .set({
          reportsIds: sql`reportsids || ${reportDoc.id}`,
        })
        .where('id', '=', orderDoc.id)
        .executeTakeFirst();
    }
    //  if(orderType === ORDER_TYPE_PICKUP){
    //  }
  });
  return result;
};
interface ReportOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ORDER_TYPE_DELIVERY } from 'hyfn-types';
import { sql } from 'kysely';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: reportOrderHandler });
};
