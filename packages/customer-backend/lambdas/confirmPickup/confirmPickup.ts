interface ConfirmPickupProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ORDER_STATUS_DELIVERED } from 'hyfn-types';
import { ObjectId } from 'mongodb';

interface ConfirmPickupProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const confirmPickup = async ({ arg, client, userId }: ConfirmPickupProps) => {
  const { orderId, country, pickupConfirmation } = arg[0];
  const { _id } = await client
    .db('generalData')
    .collection('customerInfo')
    .findOne({ customerId: userId }, { projection: { _id: 1 } });

  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) });

  if (!orderDoc.serviceFeePaid) {
    throw new Error('service fee not paid');
  }
  if (orderDoc.userId !== _id.toString()) {
    throw new Error('user Id does not match');
  }

  const confirmationStore = orderDoc.orders.find(
    (store) => store.pickupConfirmation === pickupConfirmation
  );
  if (!confirmationStore) {
    throw new Error('pickup code did not match');
  }
  const notAllStores = orderDoc.orders.find((store) => {
    if (store._id === confirmationStore._id) {
      return false;
    }

    return !store.pickedUp;
  });

  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          ['orders.$[store].pickedUp']: true,
          ['status.$[store].status']: ORDER_STATUS_DELIVERED,
          ['status.$[customer].status']: ORDER_STATUS_DELIVERED,
          ...(notAllStores ? {} : { delivered: true }),
        },
      },
      {
        arrayFilters: [
          { 'store._id': new ObjectId(confirmationStore._id) },
          { 'customer._id': _id.toString() },
        ],
      }
    );
  // if()
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: confirmPickup });
};
