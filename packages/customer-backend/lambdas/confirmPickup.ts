interface ConfirmPickupProps extends Omit<MainFunctionProps, 'arg'> {}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

interface ConfirmPickupProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const confirmPickup = async ({ arg, client, userId, db }: ConfirmPickupProps) => {
  const { orderId, pickupConfirmation } = arg[0];

  const { id } = await db
    .selectFrom('customers')
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
  if (orderDoc.customerId !== id) {
    throw new Error('user Id does not match');
  }

  if (orderDoc.storePickupConfirmation !== pickupConfirmation) {
    throw new Error('pickup code did not match');
  }

  await db
    .updateTable('orders')
    .set({
      storeStatus: [...orderDoc.storeStatus, 'pickedUp'],
      orderStatus: [...orderDoc.orderStatus, 'delivered'],
    })
    .where('id', '=', orderId)
    .execute();

  // if()
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: confirmPickup });
};
