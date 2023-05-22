export const setOrderAsPickedUpHandler = async ({
  arg,
  session,
  client,
  event,
  db,
  userId,
}: MainFunctionProps) => {
  const { orderId, confirmationCode } = arg[0];

  const driverDoc = await db
    .selectFrom('drivers')
    .select('id')
    .where('userId', '=', userId)
    .executeTakeFirst();
  const orderDoc = await db
    .selectFrom('orders')
    .select(['id', 'storePickupConfirmation'])
    .where('id', '=', orderId)
    .where('driverId', '=', driverDoc.id)
    .executeTakeFirstOrThrow();
  if (confirmationCode !== orderDoc.storePickupConfirmation) throw new Error('code does not match');
  await db
    .updateTable('orders')
    .set({
      storeStatus: sql`store_status || ${'pickedUp'}`,
    })
    .where('id', '=', orderId)
    .where('driverId', '=', driverDoc.id)
    .execute();
  return 'success';
};
interface SetOrderAsPickedUpProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

import { sql } from 'kysely';

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setOrderAsPickedUpHandler });
};
