export const removeDriverFromManagementDriversHandler = async ({
  arg,
  client,
  userId,
  session,
}: MainFunctionProps) => {
  const { driverId } = arg[0];
  const userDocument = await client
    .db('generalData')
    .collection('driverManageMent')
    .findOne({ userId });
  const { _id, verified } = userDocument;
  const managementId = _id.toString();
  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne({ _id: new ObjectId(driverId) }, { session });
  const storeTrustsDriver = driverDoc?.driverManagement[0] === _id.toString();
  if (!storeTrustsDriver) {
    throw new Error('this driver is not in your list');
  }
  const activeOrders = await client
    .db('base')
    .collection('orders')
    .find(
      {
        status: {
          $elemMatch: {
            _id: _id.toString(),
            userType: USER_TYPE_DRIVER,
            status: { $ne: USER_STATUS_DELIVERED },
          },
        },
      },
      { session }
    )
    .limit(1)
    .toArray();

  if (activeOrders) {
    await client
      .db('generalData')
      .collection('driverData')
      .updateOne(
        { _id: new ObjectId(driverId) },
        {
          $set: {
            removeDriverAfterOrder: true,
          },
        },
        { session }
      );
    return 'driver will be removed after they delivers their orders';
  }

  await client
    .db('generalData')
    .collection('driverData')
    .updateOne(
      { _id: new ObjectId(driverId) },
      {
        $set: {
          driverManagement: [],
          balance: 0,
        },
      },
      { session }
    );

  return 'driver was removed from trusted list';
};
interface RemoveDriverFromManagementDriversProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { USER_STATUS_DELIVERED, USER_TYPE_DRIVER } from 'hyfn-types';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  const result = await mainWrapper({
    event,
    mainFunction: removeDriverFromManagementDriversHandler,
  });
  return result;
};
