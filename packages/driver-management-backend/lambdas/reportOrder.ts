export const reportOrderHandler = async ({ arg, client }: MainFunctionProps) => {
  const session = client.startSession();
  const result = await withTransaction({
    session,
    fn: async () => {
      const { report, orderId, country } = arg[0];
      const orderDoc = await client
        .db('base')
        .collection('orders')
        .findOne({ _id: new ObjectId(orderId) }, {});
      // TODO: check the userId of the user who called this function and see
      // if it doesn't match with the userId in the orderDoc then throw
      if (orderDoc.delivered) {
        throw new Error('order is already delivered');
      }
      const orderType = orderDoc.orderType;
      if (orderType === ORDER_TYPE_DELIVERY) {
        if (!orderDoc.serviceFeePaid) {
          throw new Error(
            'service fee not paid, can`t report an order when the service fee is not paid'
          );
        }
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
              },
              $push: {
                reportId: reportDoc.insertedId.toString(),
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
              },
              $push: {
                reportId: reportDoc.insertedId.toString(),
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
              },
              $push: {
                reportId: reportDoc.insertedId.toString(),
              },
            },
            { session }
          );
      }
      //  if(orderType === ORDER_TYPE_PICKUP){
      //  }
    },
  });
  await session.endSession();
  return result;
};
interface ReportOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
import { ORDER_TYPE_DELIVERY } from 'hyfn-types';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: reportOrderHandler });
};