import { ObjectId } from 'mongodb';
import { gibbrish } from 'hyfn-types';
import { MainFunctionProps } from 'hyfn-server';
// monthlySubscriptionPaid: false
// expirationDate
// 2022-12-20T00:00:00.000+00:00
export const updateStoreSubscriptionToExpired = async ({ client, storeId }) => {
  await client
    .db('generalData')
    .collection('storeInfo')
    .updateOne(
      { id: new ObjectId(storeId) },
      {
        $set: {
          monthlySubscriptionPaid: false,
        },
      },
      {}
    );
  await client
    .db('generalData')
    .collection('storeFronts')
    .updateOne(
      { id: new ObjectId(storeId) },
      {
        $set: {
          city: gibbrish,
        },
      },
      {}
    );
};
