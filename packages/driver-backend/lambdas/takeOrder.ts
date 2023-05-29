('use strict');

import { add, largerEq, multiply, subtract } from 'mathjs';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { returnsObj } from 'hyfn-types';

interface TakeOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const takeOrderHandler = async ({ arg, client, userId, db }: MainFunctionProps) => {
  const result = await db.transaction().execute(async (db) => {
    const { country, orderId } = arg[0];

    const driverDoc = await db
      .selectFrom('drivers')
      .selectAll()
      .where('userId', '=', userId)
      .executeTakeFirstOrThrow();
    if (!driverDoc) {
      throw new Error(returnsObj['driver not found']);
    }

    if (driverDoc?.reportsIds?.length > 0) {
      throw new Error(returnsObj['You have a reported order']);
    }

    if (!driverDoc?.driverManagement) {
      throw new Error(returnsObj['You are not trusted by a driver management']);
    }

    const orderDoc = await db
      .selectFrom('orders')
      .selectAll()
      .where(({ and, cmpr }) =>
        and([
          cmpr('id', '=', orderId),
          // cmpr('driverStatus', '@>', sql`array[${sql.join(['set'])}]::varchar[]`),
        ])
      )
      .executeTakeFirstOrThrow();
    if (!orderDoc) {
      throw new Error('order not found');
    }

    const orderCost = orderDoc.orderCost;
    const usedBalance = driverDoc.usedBalance || 0;
    const availableBalance = subtract(driverDoc.balance, usedBalance);
    const driverBalanceCanCoverTheOrder = largerEq(availableBalance, orderCost);
    const newUsedBalance = add(usedBalance, orderCost);
    if (!driverBalanceCanCoverTheOrder) {
      throw new Error(returnsObj['Balance is not enough']);
    }

    const proposal = orderDoc.proposals.find(
      (proposal) => proposal.driverId === orderDoc.acceptedProposal
    );
    if (!proposal) {
      throw new Error(returnsObj['proposal not found']);
    }

    await db
      .updateTable('orders')
      .set({
        driverId: orderDoc.acceptedProposal,
        driverManagement: proposal.managementId,
        deliveryFee: proposal.price,
        driverStatus: [...(orderDoc?.driverStatus || []), 'set'],
      })
      .where('id', '=', orderId)
      .executeTakeFirstOrThrow();

    await db
      .updateTable('drivers')
      .set({
        usedBalance: newUsedBalance,
      })
      .where('id', '=', proposal.driverId)
      .executeTakeFirst();
    return 'success';
  });
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({
    mainFunction: takeOrderHandler,
    event,
  });
};
