export const removeDriverFromManagementDriversHandler = async ({
  arg,

  userId,

  db,
}: MainFunctionProps) => {
  const { driverId, management = 'driverManagements' } = arg[0];

  const userDocument = await db
    .selectFrom(management === 'driverManagements' ? 'driverManagements' : 'stores')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  const { id } = userDocument;

  const driverDoc = await db
    .selectFrom('drivers')
    .selectAll()
    .where('id', '=', driverId)
    .executeTakeFirstOrThrow();
  const storeTrustsDriver = driverDoc?.driverManagement === id.toString();
  if (!storeTrustsDriver) {
    throw new Error(returnsObj['this driver is not in your list']);
  }

  const activeOrders = await db
    .selectFrom('orders')
    .select('id')
    .where(({ and, cmpr, not }) =>
      and([
        cmpr('driverId', '=', driverDoc.id),
        not(cmpr('orderStatus', '@>', sql`array[${sql.join(['delivered'])}]::varchar[]` as any)),
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
    return returnsObj['driver will be removed after they deliver their orders'];
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

  return returnsObj['driver was removed from trusted list'];
};
interface RemoveDriverFromManagementDriversProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');

import { MainFunctionProps, mainWrapper, tOrder } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { sql } from 'kysely';
import { returnsObj } from 'hyfn-types';
export const handler = async (event) => {
  const result = await mainWrapper({
    event,
    mainFunction: removeDriverFromManagementDriversHandler,
  });
  return result;
};
