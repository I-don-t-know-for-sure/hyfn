import { ObjectId } from 'mongodb';

import { ORDER_TYPE_DELIVERY } from '../common/constants';
import { MainFunctionProps } from 'hyfn-server/src';
import { mainWrapperWithSession } from 'hyfn-server/src';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client, session }: MainFunctionProps) => {
    const { report, orderId, country } = arg[0];

    const orderDoc = await client
      .db('base')
      .collection('orders')
      .findOne({ _id: new ObjectId(orderId) }, {});
    if (!orderDoc) {
      throw new Error('bdhbc');
    }
    // TODO: check the userId of the user who called this function and see
    // if it doesn't match with the userId in the orderDoc then throw

    if (orderDoc.delivered) {
      throw new Error('order is already delivered');
    }
    const orderType = orderDoc.orderType;

    if (orderType === ORDER_TYPE_DELIVERY) {
      // if (!orderDoc.serviceFeePaid) {
      //   throw new Error(
      //     'service fee not paid, can`t report an order when the service fee is not paid'
      //   );
      // }

      const reportDoc = await client
        .db('generalData')
        .collection('reports')
        .insertOne(
          {
            ...report,
            orderId,
            country,
            timeOfReport: new Date(),
          },
          { session }
        );
      console.log('🚀 ~ file: reportOrder.js:38 ~ mainFunction ~ reportDoc', reportDoc);

      const driverId = orderDoc.status.find((status) => {
        return status.userType === 'driver';
      })?._id;
      await client
        .db('generalData')
        .collection('driverData')
        .updateOne(
          { _id: new ObjectId(driverId) },
          {
            $set: {
              reported: true,
              customerReportId: reportDoc.insertedId.toString(),
            },
          },
          { session }
        );

      await client
        .db('generalData')
        .collection('customerInfo')
        .updateOne(
          { _id: new ObjectId(orderDoc.userId) },
          {
            $set: {
              reported: true,
              customerReportId: reportDoc.insertedId.toString(),
            },
          },
          { session }
        );

      await client
        .db('base')
        .collection('orders')
        .updateOne(
          { _id: new ObjectId(orderId) },
          {
            $set: {
              reported: true,
              customerReportId: reportDoc.insertedId.toString(),
            },
          },
          { session }
        );
    }

    //  if(orderType === ORDER_TYPE_PICKUP){

    //  }
  };

  return await mainWrapperWithSession({ event, mainFunction });
};
