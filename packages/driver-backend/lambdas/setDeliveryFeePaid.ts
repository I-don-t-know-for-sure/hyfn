interface SetDeliveryFeePaidProps extends Omit<MainFunctionProps, 'arg'> {}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
interface SetDeliveryFeePaidProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const setDeliveryFeePaid = async ({ arg, client, userId, db }: SetDeliveryFeePaidProps) => {
  const { orderId } = arg[0];

  const driverDoc = await db
    .selectFrom('drivers')
    .select('id')
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();

  await db
    .updateTable('orders')
    .set({
      deliveryFeePaid: true,
    })
    .where('id', '=', orderId)
    .where('driverId', '=', driverDoc.id)
    .executeTakeFirst();
  return 'success';
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setDeliveryFeePaid });
};
