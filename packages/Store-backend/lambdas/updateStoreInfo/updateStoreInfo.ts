interface UpdateStoreInfoProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { ObjectId } from 'mongodb';

import { currencies } from '../resources';
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client, session }: MainFunctionProps) => {
    var result;

    const { storeFrontId, id, city, country } = arg[0];
    const newInfo = arg[1];
    const { imgaeObj, userId, balance, ...newStore } = newInfo;
    const { userId: merchantId } = arg[arg.length - 1];
    const mongo = client.db('base');
    const storeCollection = client.db('generalData').collection(`storeInfo`);
    const storeFrontCollection = mongo.collection(`storeFronts`);

    const storeDoc = await storeCollection.findOne({
      userId: merchantId,
    });

    const coordsArray = newStore.coords.split(',');

    console.log(JSON.stringify(coordsArray));
    if (Array.isArray(coordsArray)) {
      if (coordsArray.length === 2) {
        const float1 = parseFloat(coordsArray[0]);
        const float2 = parseFloat(coordsArray[1]);
        console.log(JSON.stringify(coordsArray));
        const coords = { type: 'Point', coordinates: [float2, float1] };

        await storeCollection.updateOne(
          { userId: merchantId },
          {
            $set: { ...newStore, coords: coords, currency: currencies[country] },
          },
          {}
        );

        await storeFrontCollection.updateOne(
          { _id: new ObjectId(storeDoc._id.toString()) },
          {
            $set: {
              storeName: newStore.storeName,
              currency: currencies[country],

              storePhone: newStore.storePhone,
              image: newStore.image,
              storeType: newStore.storeType,

              city:
                storeDoc.storeInfoFilled &&
                storeDoc.storeOwnerInfoFilled &&
                storeDoc.monthlySubscriptionPaid
                  ? newStore.city
                  : 'gibbrish',
              description: newStore.description,
              coords: coords,
            },
          },
          {}
        );
      }
    }

    return result;
  };
  return await mainWrapperWithSession({
    event,
    ctx,
    mainFunction,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
