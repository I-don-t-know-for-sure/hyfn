interface LeaveOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

import { returnsObj } from 'hyfn-types';
export const leaveOrderHandler = async ({ arg, client, userId, db }: MainFunctionProps) => {
  const result = await db.transaction().execute(async (trx) => {
    // const driverDoc = await trx
    // .selectFrom('drivers')
    // .selectAll()
    // .where('userId', '=', userId)
    // .executeTakeFirstOrThrow();
    const { orderId, country } = arg[0];
    // check if the order is delivered if true then throw an error
    // check if the customer paid for any store if true then throw an error

    const orderDoc = await trx
      .selectFrom('orders')
      .selectAll()
      .where('id', '=', orderId)
      .executeTakeFirstOrThrow();
    if (orderDoc.orderStatus.includes('delivered')) {
      throw new Error(returnsObj['Order is already delivered']);
    }

    const serviceFeePaid = orderDoc.serviceFeePaid;
    if (serviceFeePaid) {
      throw new Error('service fee already paid');
    }

    if (orderDoc.orderStatus.includes('reporeted')) {
      throw new Error('this order is blocked because it`s reported');
    }
    if (orderDoc.storeStatus.includes('paid')) {
      throw new Error(returnsObj['there is a paid store']);
    }

    await trx
      .updateTable('orders')
      .set({
        driverManagement: undefined,
        deliveryFee: undefined,
        acceptedProposal: undefined,
        driverId: undefined,
        driverStatus: ['initial'],
      })
      .where('id', '=', orderId)
      .execute();
  });

  return result;
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: leaveOrderHandler });
};
