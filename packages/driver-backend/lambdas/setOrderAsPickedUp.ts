export const setOrderAsPickedUpHandler = async ({
  arg,
  session,
  client,
  event,
}: MainFunctionProps) => {
  var result;
  const { id, country, driverId, orderId } = arg[0];
  const driverDoc = await client.db('generalData').collection('driverData').findOne(
    {
      driverId,
    },
    {}
  );
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) }, {});

  if (!orderDoc.status.find((status) => status._id === driverDoc._id.toString())) {
    throw new Error('driver did not take the order');
  }

  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { '_id': new ObjectId(orderId), 'status._id': id },
      {
        $set: {
          'status.$': { _id: id, status: DRIVER_STATUS_PICKEDUP },
        },
      },
      {}
    );

  return 'success';
};
interface SetOrderAsPickedUpProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { DRIVER_STATUS_PICKEDUP } from 'hyfn-types';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setOrderAsPickedUpHandler });
};
