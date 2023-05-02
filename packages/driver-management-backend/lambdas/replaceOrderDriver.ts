import { USER_STATUS_DELIVERED, USER_TYPE_DRIVER } from 'hyfn-types';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { add, largerEq, smaller } from 'mathjs';

interface ReplaceOrderDriverProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const replaceOrderDriverHandler = async ({
  arg,
  client,
  userId,
}: ReplaceOrderDriverProps) => {
  const { orderId, newDriverId, oldDriverId } = arg[0];

  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) });
  if (!orderDoc) throw new Error('order not found');
  // const oldDriver = orderDoc.status.find((status) => {})
  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne({ _id: new ObjectId(newDriverId) });
  if (!driverDoc) throw new Error('driver not');
  // check if the newdriver has enough balance
  if (smaller(driverDoc.balance, add(driverDoc.usedBalance || 0, orderDoc.orderCost))) {
    throw new Error('not enough balance');
  }

  await client
    .db('generalData')
    .collection('driverData')
    .updateOne({ _id: new ObjectId(newDriverId) }, { $inc: { usedBalance: orderDoc.orderCost } });

  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          'status.$[status]._id': newDriverId,
        },
      },
      {
        arrayFilters: [{ 'status.userType': USER_TYPE_DRIVER }],
      }
    );

  await client
    .db('generalData')
    .collection('driverData')
    .updateOne(
      { _id: new ObjectId(oldDriverId) },
      {
        $inc: { usedBalance: orderDoc.orderCost * -1 },
      }
    );
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: replaceOrderDriverHandler });
};
