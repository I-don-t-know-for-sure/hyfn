import { log } from 'console';
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { gibbrish } from 'hyfn-types';
import { ObjectId } from 'mongodb';
('use strict');
interface OpenAndCloseStoreProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const openAndCloseStoreHandler = async ({
  arg,
  client,
  session,
  userId,
}: MainFunctionProps) => {
  var result;

  const country = arg[1];
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ usersIds: userId }, {});
  if (!storeDoc) throw new Error('store not found');
  const storeId = storeDoc._id.toString();
  // const storeDoc = await client
  //   .db('generalData')
  //   .collection('storeInfo')
  //   .findOne(
  //     {
  //       _id: new ObjectId(storeId),
  //     },
  //     { session }
  //   );
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
  console.log(storeDoc.localCardAPIKeyFilled || storeDoc.sadadFilled);
  console.log(storeDoc.monthlySubscriptionPaid);
  console.log(
    storeDoc.storeOwnerInfoFilled

    // storeTrustsTwoDrivers &&
  );
  console.log(
    storeDoc.storeInfoFilled

    // storeTrustsTwoDrivers &&
  );
  console.log(
    // storeTrustsTwoDrivers &&
    !storeDoc.opened,
    'hbhbhbhbhhbbhbhb'
  );

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
        },
      },
      { session }
    );
  return result;
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
};
export const handler = async (event, ctx) => {
  return await mainWrapperWithSession({
    event,
    ctx,
    mainFunction: openAndCloseStoreHandler,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });
};
