export const setOrderAsDeliveredHandler = async ({ arg, client, session }: MainFunctionProps) => {
  var result;
  const { id, country, confirmationCode, orderId } = arg[0];
  console.log('🚀 ~ file: setOrderAsDelivered.js:20 ~ mainFunction ~ arg', arg[0]);
  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne(
      {
        _id: new ObjectId(id),
      },
      { session }
    );
  const { orderIds } = driverDoc;
  const driverTakenOrder = orderIds.find((id) => id === orderId);
  if (!driverTakenOrder) {
    throw new Error('driver did not take the order');
  }
  if (!driverDoc?.onDuty) {
    throw new Error('driver is not on duty');
  }
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne(
      {
        _id: new ObjectId(orderId),
      },
      { session }
    );
  orderDoc.orders.some((store) => {
    if (!store?.paid) {
      result = 'not all stores are paid';
      throw new Error('not all stores are paid');
    }
    return;
  });
  if (orderDoc.confirmationCode !== confirmationCode) {
    throw new Error('Confirmation Code does not match');
  }
  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { '_id': new ObjectId(orderId), 'status._id': id },
      {
        $set: {
          deliveryDate: new Date(),
          delivered: true,
          ['status.$[driver].status']: USER_STATUS_DELIVERED,
          ['status.$[customer].status']: USER_STATUS_DELIVERED,
        },
      },
      {
        session,
        arrayFilters: [{ 'driver._id': id }, { 'customer._id': orderDoc.userId }],
      }
    );
  const removeDriverAfterOrder = driverDoc.removeDriverAfterOrder;
  if (removeDriverAfterOrder) {
    await client
      .db('generalData')
      .collection('driverData')
      .updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            onDuty: false,
            orderId: '',
            driverManagement: [],
            removeDriverAfterOrder: false,
          },
        },
        { session }
      );
    await client
      .db('generalData')
      .collection('driverManagement')
      .updateOne(
        { _id: new ObjectId(driverDoc.driverManagement[0]) },
        {
          $inc: {
            usedBalance: -Math.abs(parseInt(driverDoc.balance)),
            balance: Math.abs(parseFloat(orderDoc.managementFee.toFixed(3))),
            profits: Math.abs(parseFloat(orderDoc.managementFee.toFixed(3))),
          },
        },
        { session }
      );
    return 'success';
  }
  await client
    .db('generalData')
    .collection('driverManagement')
    .updateOne(
      { _id: new ObjectId(driverDoc.driverManagement[0]) },
      {
        $inc: {
          balance: Math.abs(parseFloat(orderDoc.managementFee.toFixed(3))),
          profits: Math.abs(parseFloat(orderDoc.managementFee.toFixed(3))),
        },
      },
      { session }
    );
  await client
    .db('generalData')
    .collection('driverData')
    .updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          onDuty: false,
          orderId: '',
        },
      },
      { session }
    );
  result = 'success';
  return result;
};
interface SetOrderAsDeliveredProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { ObjectId } from 'mongodb';
import { USER_STATUS_DELIVERED } from 'hyfn-types';
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
export const handler = async (event) => {
  return await mainWrapperWithSession({
    mainFunction: setOrderAsDeliveredHandler,
    event,
  });
};
