interface ReportOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import { ORDER_TYPE_DELIVERY } from 'hyfn-types';
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
export const reportOrderHandler = async ({ arg, client }: MainFunctionProps) => {
  const session = client.startSession();
  const result = await withTransaction({
    session,
    fn: async () => {
      const { report, orderId, country } = arg[0];
      const orderDoc = await client
        .db('base')
        .collection('orders')
        .findOne({ id: new ObjectId(orderId) }, {});
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
        })?.id;
        await client
          .db('generalData')
          .collection('driverData')
          .updateOne(
            { id: new ObjectId(driverId) },
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
            { id: new ObjectId(orderDoc.userId) },
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
            { id: new ObjectId(orderId) },
            {
              $set: {
                reported: true,
                customerReportId: reportDoc.insertedId.toString(),
              },
            },
            { session }
          );
      }
    },
  });

  await session.endSession();
  return result;
  //  if(orderType === ORDER_TYPE_PICKUP){
  //  }
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: reportOrderHandler });
};
