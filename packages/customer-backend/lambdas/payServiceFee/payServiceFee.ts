interface PayServiceFeeProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import { smaller } from 'mathjs';
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
import { findOne, updateOne } from 'hyfn-server';
import { STORE_STATUS_ACCEPTED } from 'hyfn-types';
interface payServiceFeeProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
const payServiceFee = async ({ arg, client, userId }: payServiceFeeProps) => {
  const session = client.startSession();
  const result = await withTransaction({
    session,
    fn: async () => {
      const customerId = userId;
      const { orderId, country } = arg[0];
      const orderDoc = await client
        .db('base')
        .collection('orders')
        .findOne({ _id: new ObjectId(orderId) }, { session });
      findOne({ findOneResult: orderDoc });
      const userDoc = await client
        .db('generalData')
        .collection('customerInfo')
        .findOne({ customerId: customerId }, { session });
      if (!userDoc) {
        throw new Error('cdb');
      }
      if (!orderDoc) {
        throw new Error('bdhc');
      }
      findOne({ findOneResult: userDoc });
      if (orderDoc.orders.find((storeOrder) => storeOrder.orderStatus !== STORE_STATUS_ACCEPTED)) {
        throw new Error('order not accepted yet');
      }
      if (smaller(userDoc.balance, orderDoc.serviceFee)) {
        throw new Error('balance is insufficient');
      }
      if (userDoc._id.toString() !== orderDoc.userId) {
        throw new Error('user id does not match');
      }
      if (orderDoc?.serviceFeePaid) {
        throw new Error('service fee already paid');
      }
      const updateResult = await client
        .db('base')
        .collection('orders')
        .updateOne(
          { _id: new ObjectId(orderId) },
          {
            $set: {
              serviceFeePaid: true,
            },
          },
          { session }
        );
      updateOne({ updateOneResult: updateResult });
      const updateCustomer = await client
        .db('generalData')
        .collection('customerInfo')
        .updateOne(
          { customerId: customerId },
          {
            $inc: {
              balance: -Math.abs(parseFloat(orderDoc.serviceFee)),
            },
          },
          { session }
        );
    },
  });
  await session.endSession();
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: payServiceFee });
};
