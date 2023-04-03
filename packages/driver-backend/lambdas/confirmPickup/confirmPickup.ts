interface ConfirmPickupProps extends Omit<MainFunctionProps, 'arg'> {}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ORDER_STATUS_DELIVERED, ORDER_STATUS_PICKED, USER_TYPE_DRIVER } from 'hyfn-types';
import { ObjectId } from 'mongodb';
interface ConfirmPickupProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const confirmPickup = async ({ arg, client, userId }: ConfirmPickupProps) => {
  const { orderId, country, pickupConfirmation } = arg[0];
  const { _id } = await client
    .db('generalData')
    .collection('driverData')
    .findOne({ driverId: userId }, { projection: { _id: 1 } });
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) });
  if (!orderDoc.serviceFeePaid) {
    throw new Error('service fee not paid');
  }
  if (
    orderDoc.status.find((status) => status.userType === USER_TYPE_DRIVER)._id !== _id.toString()
  ) {
    throw new Error('driver id does not match');
  }
  const store = orderDoc.orders.find((store) => store.pickupConfirmation === pickupConfirmation);
  if (!store) {
    throw new Error('pickup code did not match');
  }
  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          ['orders.$[store].orderStatus']: ORDER_STATUS_PICKED,
          ['status.$[store].status']: ORDER_STATUS_DELIVERED,
        },
      },
      { arrayFilters: [{ 'store._id': new ObjectId(store._id) }] }
    );
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: confirmPickup });
};
