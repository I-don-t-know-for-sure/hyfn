import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { USER_STATUS_DELIVERED, USER_TYPE_DRIVER } from 'hyfn-types';
import { ObjectId } from 'mongodb';

interface GetOrdersProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const getOrders = async ({ arg, client, userId }: GetOrdersProps) => {
  const { active, lastDoc } = arg[0];
  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne({ driverId: userId });
  return await client
    .db('base')
    .collection('orders')
    .find({
      ...(lastDoc ? { _id: { $gt: new ObjectId(lastDoc) } } : {}),
      'status.$': {
        _id: driverDoc._id.toString(),
        userType: USER_TYPE_DRIVER,
        status: active ? { $ne: USER_STATUS_DELIVERED } : USER_STATUS_DELIVERED,
      },
    })
    .limit(10)
    .toArray();
};

export const handler = async (event: any) => {
  return await mainWrapper({ event, mainFunction: getOrders });
};
