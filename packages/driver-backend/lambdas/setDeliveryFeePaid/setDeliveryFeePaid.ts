interface SetDeliveryFeePaidProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

interface SetDeliveryFeePaidProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const setDeliveryFeePaid = async ({ arg, client, userId }: SetDeliveryFeePaidProps) => {
  const { country } = arg[0];
  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne({ driverId: userId });
  if (!driverDoc.onDuty) {
    throw new Error('driver has no active order');
  }

  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { _id: new ObjectId(driverDoc.orderId) },
      {
        $set: {
          deliveryFeePaid: true,
        },
      }
    );
  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setDeliveryFeePaid });
};
