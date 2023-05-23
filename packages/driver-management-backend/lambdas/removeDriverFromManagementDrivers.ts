export const removeDriverFromManagementDriversHandler = async ({
  arg,
  client,
  userId,
  session,
  db,
}: MainFunctionProps) => {
  const { driverId } = arg[0];

  const userDocument = await db
    .selectFrom('driverManagements')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  const { id, verified } = userDocument;
  const managementId = id.toString();

  const driverDoc = await db
    .selectFrom('drivers')
    .selectAll()
    .where('id', '=', driverId)
    .executeTakeFirstOrThrow();
  const storeTrustsDriver = driverDoc?.driverManagement === id.toString();
  if (!storeTrustsDriver) {
    throw new Error('this driver is not in your list');
  }
  // const activeOrders = await client
  //   .db('base')
  //   .collection('orders')
  //   .find(
  //     {
  //       status: {
  //         $elemMatch: {
  //          id: id.toString(),
  //           userType: USER_TYPE_DRIVER,
  //           status: { $ne: USER_STATUS_DELIVERED },
  //         },
  //       },
  //     },
  //     { session }
  //   )
  //   .limit(1)
  //   .toArray();
  const activeOrders = await db
    .selectFrom('orders')
    .select('id')
    .where(({ and, cmpr, not }) =>
      and([
        cmpr('driverId', '=', driverDoc.id),
        not(
          cmpr('orderStatus', '@>', sql`array[${sql.join(['delivered'] as tOrder['orderStatus'])}]`)
        ),
      ])
    )
    .limit(1)
    .execute();
  if (activeOrders) {
    await db
      .updateTable('drivers')
      .set({
        removeDriverAfterOrder: true,
      })
      .where('id', '=', driverId)
      .execute();
    return 'driver will be removed after they delivers their orders';
  }

  await db
    .updateTable('drivers')
    .set({
      driverManagement: undefined,
      balance: 0,
      usedBalance: 0,
    })
    .where('id', '=', driverId)
    .execute();

  return 'driver was removed from trusted list';
};
interface RemoveDriverFromManagementDriversProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { USER_STATUS_DELIVERED, USER_TYPE_DRIVER } from 'hyfn-types';
import { MainFunctionProps, mainWrapper, tOrder } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { sql } from 'kysely';
export const handler = async (event) => {
  const result = await mainWrapper({
    event,
    mainFunction: removeDriverFromManagementDriversHandler,
  });
  return result;
};
