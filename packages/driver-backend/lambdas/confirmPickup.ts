interface ConfirmPickupProps extends Omit<MainFunctionProps, 'arg'> {}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ORDER_STATUS_DELIVERED, ORDER_STATUS_PICKED, USER_TYPE_DRIVER } from 'hyfn-types';
import { ObjectId } from 'mongodb';
interface ConfirmPickupProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const confirmPickup = async ({ arg, client, userId, db }: ConfirmPickupProps) => {
  const { orderId, country, pickupConfirmation } = arg[0];

  const { id } = await db
    .selectFrom('drivers')
    .select('id')
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();

  const orderDoc = await db
    .selectFrom('orders')
    .selectAll()
    .where('id', '=', orderId)
    .executeTakeFirstOrThrow();
  if (!orderDoc.serviceFeePaid) {
    throw new Error('service fee not paid');
  }
  if (orderDoc.driverId !== id) {
    throw new Error('driver id does not match');
  }

  if (orderDoc.storePickupConfirmation !== pickupConfirmation) {
    throw new Error('pickup code did not match');
  }

  await db
    .updateTable('orders')
    .set({
      storeStatus: [...orderDoc.storeStatus, 'pickedUp'],
    })
    .executeTakeFirst();
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: confirmPickup });
};
