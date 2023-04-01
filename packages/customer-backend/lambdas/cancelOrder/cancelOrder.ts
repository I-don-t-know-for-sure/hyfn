interface CancelOrderProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { ObjectId } from 'mongodb';
import {
  ORDER_STATUS_PREPARING,
  ORDER_STATUS_READY,
  ORDER_TYPE_DELIVERY,
  ORDER_TYPE_PICKUP,
  USER_TYPE_DRIVER,
} from '../common/constants';

import { findOne, mainWrapperWithSession, updateOne } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';

interface CancelOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const cancelOrder = async ({ arg, client, session, userId }: CancelOrderProps) => {
  const userDocument = await client
    .db('generalData')
    .collection('customerInfo')
    .findOne({ customerId: userId }, { session });
  findOne({ findOneResult: userDocument });
  const { orderId, country } = arg[0];
  if (!userDocument) {
    return;
  }
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) }, { session });
  findOne({ findOneResult: orderDoc });
  if (!orderDoc) {
    throw new Error('j');
  }
  console.log('🚀 ~ file: cancelOrder.js:16 ~ mainFunction ~ userDocument', userDocument._id);
  if (orderDoc.userId !== userDocument._id.toString()) {
    throw new Error('this user did not make this order');
  }
  // check if the order is already delivered
  if (orderDoc.delivered) {
    throw new Error('Order already delivered');
  }
  // check if the customer paid any store. if so then they can not cancel the order
  const orderHasPaidStores = orderDoc.orders.some((store) => {
    return store.paid;
  });

  if (orderHasPaidStores) {
    throw new Error('order has paid stores');
  }

  // check if any of the stores orders are being prepared or already prepared
  const isAnyOfTheOrdersPrepared = orderDoc.orders.some((status) => {
    return (
      status.orderStatus === ORDER_STATUS_PREPARING || status.orderStatus === ORDER_STATUS_READY
    );
  });
  const orderReported = orderDoc.reported;
  if (orderReported) {
    throw new Error('this order is blocked because it`s reported');
  }

  if (isAnyOfTheOrdersPrepared) {
    throw Error('order is being prepared or order is ready');
  }

  const orderType = orderDoc.orderType;

  if (orderType === ORDER_TYPE_PICKUP) {
    const customerUpdateResult = await client
      .db('generalData')
      .collection('customerInfo')
      .updateOne(
        { _id: new ObjectId(orderDoc.userId) },
        {
          $inc: {
            balance: Math.abs(parseFloat(orderDoc.serviceFee.toFixed(3))),
          },
        },
        { session }
      );
    updateOne({ updateOneResult: customerUpdateResult });
    // await client
    //   .db('generalData')
    //   .collection('customerInfo')
    //   .updateOne(
    //     {
    //       _id: new ObjectId(orderDoc.userId),
    //     },
    //     {
    //       $inc: {
    //         balance: Math.abs(parseFloat(orderDoc.serviceFee.toFixed(3))),
    //       },
    //     }
    //   );

    // delete order
    const orderUpdateResult = await client
      .db('base')
      .collection('orders')
      .updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            canceled: true,
          },
        },
        { session }
      );

    updateOne({ updateOneResult: orderUpdateResult });
  }
  if (orderType === ORDER_TYPE_DELIVERY) {
    // check if the order is taken by a driver // also the customer can cancel within 5 minutes after the order
    // was taken by a driver
    const isOrderTakenByDriver = orderDoc.status.find((status) => {
      if (status.userType === USER_TYPE_DRIVER) {
        if (status._id === '') {
          return false;
        }
        return true;
      }
    });

    if (isOrderTakenByDriver) {
      const driverDataUpdate = await client
        .db('generalData')
        .collection('driverData')
        .updateOne(
          { _id: new ObjectId(isOrderTakenByDriver._id) },
          {
            $set: {
              onDuty: false,
              orderId: '',
            },
          },
          { session }
        );
      updateOne({ updateOneResult: driverDataUpdate });
    }
    // if (isOrderTakenByDriver) {
    //   throw new Error('Order is taken by driver');
    // }

    if (orderDoc.serviceFeePaid) {
      // return the customer thier money before deleting the order document
      const customerUpdateResult = await client
        .db('generalData')
        .collection('customerInfo')
        .updateOne(
          {
            _id: new ObjectId(orderDoc.userId),
          },
          {
            $inc: {
              balance: Math.abs(parseFloat(orderDoc.serviceFee.toFixed(3))),
            },
          },
          { session }
        );
      updateOne({ updateOneResult: customerUpdateResult });

      // await updateOne({
      //   query: {
      //     _id: new ObjectId(orderDoc.userId),
      //   },
      //   update: {
      //     $inc: {
      //       balance: Math.abs(parseFloat(orderDoc.serviceFee.toFixed(3))),
      //     },
      //   },
      //   options: { session },
      //   collection: client.db('generalData').collection('customerInfo'),
      // });
    }
    // delete order
    const orderUpdateResult = await client
      .db('base')
      .collection('orders')
      .updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            canceled: true,
          },
        },
        { session }
      );
    updateOne({ updateOneResult: orderUpdateResult });
    return 'success';
  }
};
export const handler = async (event) => {
  return await mainWrapperWithSession({ event, mainFunction: cancelOrder });
};
