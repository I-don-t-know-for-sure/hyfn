export const openAndCloseStoreHandler = async ({ arg, client, session }: MainFunctionProps) => {
  var result;
  const storeId = arg[0];
  const country = arg[1];
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne(
      {
        _id: new ObjectId(storeId),
      },
      { session }
    );
  if (!storeDoc.monthlySubscriptionPaid) {
    throw new Error('you must pay the monthly subscription first');
    return;
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
interface OpenAndCloseStoreProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { ObjectId } from 'mongodb';
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
