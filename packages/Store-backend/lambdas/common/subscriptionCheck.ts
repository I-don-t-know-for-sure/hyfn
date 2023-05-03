import { MongoClient, ObjectId } from 'mongodb';
import { gibbrish } from 'hyfn-types';
import { MainFunctionProps } from 'hyfn-server';
export const subscriptionCheck = async ({
  //   expirationDate,
  //   monthlySubscriptionPaid,
  storeDoc,
  client,
  storeId,
  session,
}: {
  storeDoc: any;
  client: MongoClient;
  storeId: any;
  session: any;
}) => {
  console.log('🚀 ~ file: subscriptionCheck.js:11 ~ storeId', storeId);
  // const {
  //   monthlySubscriptionPaid,
  //   subscriptionInfo: { expirationDate },
  // } = storedoc;
  const monthlySubscriptionPaid = storeDoc?.monthlySubscriptionPaid;
  const expirationDate = storeDoc?.subscriptionInfo?.expirationDate;
  const now = new Date();
  console.log('🚀 ~ file: subscriptionCheck.js:15 ~ expirationDate', expirationDate);
  console.log('🚀 ~ file: subscriptionCheck.js:17 ~ now', now);
  const { country } = storeDoc.storeDoc;
  if (monthlySubscriptionPaid) {
    if (expirationDate < now) {
      await client
        .db('base')
        .collection('storeFronts')
        .updateOne(
          { _id: new ObjectId(storeId) },
          {
            $set: {
              city: gibbrish,
              opened: false,
            },
          },
          { session }
        );
      await client
        .db('generalData')
        .collection('storeInfo')
        .updateOne(
          { _id: new ObjectId(storeId) },
          {
            $set: {
              monthlySubscriptionPaid: false,
            },
          },
          { session }
        );
    }
  }
};
