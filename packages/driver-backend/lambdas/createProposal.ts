interface CreateProposalProps extends Omit<MainFunctionProps, 'arg'> {}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { driverSchema, USER_TYPE_DRIVER } from 'hyfn-types';
import { smaller } from 'mathjs';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
interface CreateProposalProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const createProposal = async ({ arg, client, userId, db }: CreateProposalProps) => {
  const { country, orderId, price } = arg[0];
  const projection = {};

  const driverDoc = await db
    .selectFrom('drivers')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  // if (driverDoc.onDuty) {
  //   throw new Error('You are on duty');
  // }
  if (!driverDoc) {
    throw new Error('driver doc not found');
  }
  if (driverDoc?.reportsIds?.length > 0) {
    throw new Error('You have a reported order');
  }
  console.log(driverDoc, 'hshshshssh');

  if (!driverDoc.verified) {
    throw new Error('you are not verified');
  }
  if (!driverDoc.driverManagement) {
    throw new Error('You are not trusted by a driver management');
  }

  const orderDoc = await db
    .selectFrom('orders')
    .selectAll()
    .where('id', '=', orderId)
    .executeTakeFirstOrThrow();
  if (!orderDoc) {
    throw new Error('order not found');
  }
  // if (orderDoc?.orderStatus?.includes('Canceled')) {
  //   throw new Error('Order canceled');
  // }
  if (smaller(driverDoc.balance, orderDoc.orderCost)) {
    throw new Error('driver does not have enough balance');
  }
  if (orderDoc.driverId) {
    throw new Error('Order is taken by driver');
  }

  await db
    .updateTable('orders')
    .set({
      proposalsIds: [
        ...(orderDoc?.proposalsIds?.length ? orderDoc.proposalsIds : []),
        driverDoc.driverManagement,
      ],
      proposals: [
        ...(orderDoc?.proposals?.length > 0 ? orderDoc?.proposals : []),
        {
          price,
          driverId: driverDoc.id,
          managementId: driverDoc.driverManagement,
        },
      ],
    })
    .executeTakeFirst();
  return 'success';
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createProposal });
};
