interface LeaveOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { DRIVER_STATUS_NOT_SET, USER_TYPE_DRIVER } from '../common/constants';
export const leaveOrderHandler = async ({ arg, client, userId, session }: MainFunctionProps) => {
  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne({ driverId: userId }, { projection: { _id: 1 } });
  const { orderId, country } = arg[0];
  // check if the order is delivered if true then throw an error
  // check if the customer paid for any store if true then throw an error
  const { orderIds } = driverDoc;
  const driverTakenOrder = orderIds.find((id) => id === orderId);
  if (!driverTakenOrder) {
    throw new Error('driver did not take the order');
  }
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) }, {});
  if (orderDoc.delivered) {
    throw new Error('Order is already delivered');
  }
  const paidStoreExist = orderDoc.orders.some((store) => {
    return store.paid;
  });
  const serviceFeePaid = orderDoc.serviceFeePaid;
  if (serviceFeePaid) {
    throw new Error('service fee already paid');
  }
  const orderReported = orderDoc.reported;
  if (orderReported) {
    throw new Error('this order is blocked because it`s reported');
  }
  if (paidStoreExist) {
    throw new Error('there is a paid store');
  }
  const managementCut = orderDoc.managementCut;
  const managementFee = orderDoc.originalDeliveryFee * managementCut;
  const deliveryFee = managementFee + orderDoc.deliveryFee;
  const serviceFee = orderDoc.serviceFee - orderDoc.originalDeliveryFee * managementCut;
  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { '_id': new ObjectId(orderId), 'status._id': driverDoc._id.toString() },
      {
        $set: {
          'status.$': {
            status: DRIVER_STATUS_NOT_SET,
            _id: '',
            userType: USER_TYPE_DRIVER,
          },
          deliveryFee,
          serviceFee,
        },
        $unset: {
          managementFee: '',
          driverManagement: '',
        },
      },
      { session }
    );
  await client
    .db('generalData')
    .collection('driverData')
    .updateOne(
      {
        _id: new ObjectId(driverDoc._id.toString()),
      },
      {
        $set: {
          onDuty: false,
        },
        $pull: { orderIds: orderId },
      },
      { session }
    );
};

export const handler = async (event) => {
  return await mainWrapperWithSession({ event, mainFunction: leaveOrderHandler });
};
