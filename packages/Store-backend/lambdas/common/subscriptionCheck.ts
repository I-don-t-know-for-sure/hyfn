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
  const monthlySubscriptionPaid = storeDoc?.monthlySubscriptionPaid;
  const expirationDate = storeDoc?.subscriptionInfo?.expirationDate;
  const now = new Date();

  const { country } = storeDoc.storeDoc;
  if (monthlySubscriptionPaid) {
    if (expirationDate < now) {
      await client
        .db('base')
        .collection('storeFronts')
        .updateOne(
          { id: new ObjectId(storeId) },
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
          { id: new ObjectId(storeId) },
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
