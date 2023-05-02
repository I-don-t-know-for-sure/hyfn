import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
import {
  ORDER_STATUS_ACCEPTED,
  ORDER_STATUS_PAID,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_PREPARING,
  USER_TYPE_STORE,
  gibbrish,
} from 'hyfn-types';
import { ObjectId } from 'mongodb';
('use strict');
interface OpenAndCloseStoreProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const openAndCloseStoreHandler = async ({
  arg,
  client,

  userId,
}: OpenAndCloseStoreProps) => {
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ usersIds: userId }, {});
  if (!storeDoc) throw new Error('store not found');
  const activeOrders = await client
    .db('base')
    .collection('orders')
    .find(
      {
        status: {
          $elemMatch: {
            _id: new ObjectId(storeDoc._id.toString()),
            userType: USER_TYPE_STORE,
            status: {
              $or: [
                { $eq: ORDER_STATUS_ACCEPTED },
                { $eq: ORDER_STATUS_PAID },
                { $eq: ORDER_STATUS_PENDING },
                { $eq: ORDER_STATUS_PREPARING },
              ],
            },
          },
        },
      },
      {}
    )
    .limit(1)
    .toArray();
  if (activeOrders) throw new Error('you have active orders');
  const session = client.startSession();
  const response = await withTransaction({
    session,
    fn: async () => {
      var result;

      const storeId = storeDoc._id.toString();

      if (!storeDoc.monthlySubscriptionPaid) {
        await client
          .db('base')
          .collection('storeFronts')
          .updateOne(
            {
              _id: new ObjectId(storeId),
            },
            {
              $set: {
                opened: false,

                city: gibbrish,
              },
            }
          );
        await client
          .db('generalData')
          .collection('storeInfo')
          .updateOne(
            {
              _id: new ObjectId(storeId),
            },
            {
              $set: {
                opened: false,
              },
            }
          );
        throw new Error('you must pay the monthly subscription first');
      }

      if (
        storeDoc.storeInfoFilled &&
        (storeDoc.localCardAPIKeyFilled || storeDoc.sadadFilled) &&
        storeDoc.storeOwnerInfoFilled &&
        storeDoc.monthlySubscriptionPaid &&
        // storeTrustsTwoDrivers &&
        !storeDoc.opened
      ) {
        // create storeFront document here and update store document that to isOpen : true
        await client
          .db('base')
          .collection('storeFronts')
          .updateOne(
            {
              _id: new ObjectId(storeId),
            },
            {
              $set: {
                opened: true,
                city: storeDoc.city,
              },
            },
            { session }
          );
        await client
          .db('generalData')
          .collection('storeInfo')
          .updateOne(
            {
              _id: new ObjectId(storeId),
            },
            {
              $set: {
                opened: true,
                acceptingOrders: true,
              },
            },
            { session }
          );
        result = 'success';
        return;
      }
      // delete storeFront document here and update store document that to isOpen : false
      await client
        .db('base')
        .collection('storeFronts')
        .updateOne(
          {
            _id: new ObjectId(storeId),
          },
          {
            $set: { opened: false },
          },
          { session }
        );
      await client
        .db('generalData')
        .collection('storeInfo')
        .updateOne(
          {
            _id: new ObjectId(storeId),
          },
          {
            $set: {
              opened: false,
              acceptingOrders: false,
            },
          },
          { session }
        );
      return result;
    },
  });
  await session.endSession();
  return response;
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
};
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: openAndCloseStoreHandler,
  });
};
