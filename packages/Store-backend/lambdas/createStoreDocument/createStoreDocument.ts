interface CreateStoreDocumentProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { currencies, gibbrish } from '../resources';

export const handler = async (event, ctx, callback) => {
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  const mainFunction = async ({ arg, client, session, userId }: MainFunctionProps) => {
    var result;
    const mongo = client;

    const storeInfo = arg[0];

    const storeName = storeInfo.storeName;
    const storeType = storeInfo.storeType.includes('Restaurant')
      ? ['Restaurant']
      : storeInfo.storeType;
    const storePhone = storeInfo.storePhone;

    const country = storeInfo.country;
    const city = storeInfo.city;
    const { coords, ...rest } = storeInfo;

    // const { accessToken } = arg[arg.length - 1];
    // await mainValidateFunction(client, accessToken, userId);

    // Step 2: Optional. Define options to use for the transaction

    // Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
    // Note: The callback for withTransaction MUST be async and/or return a Promise.

    //    const isIndexed = await client.db("base").collection("stores").findOne({_id: 'collectionInfo'})

    const storeFronts = await mongo.db('base').collection(`storeFronts`);
    const customUserData = await mongo.db('generalData').collection('storeInfo');

    const coordsArray = coords.split(',');

    if (Array.isArray(coordsArray)) {
      if (coordsArray.length === 2) {
        const float1 = parseFloat(coordsArray[0]);
        const float2 = parseFloat(coordsArray[1]);

        const coords = { type: 'Point', coordinates: [float2, float1] };

        const newStoreDoc = await storeFronts.insertOne(
          {
            currency: currencies[country],
            storeType,
            storePhone,
            storeName,
            image: '',
            description: storeInfo.description,
            country,
            city: gibbrish,
            opened: false,
            coords,
            ratingCount: 0,
            currentRatingTotal: 0,
            currentRating: 0,
          },
          { session }
        );

        await customUserData.insertOne(
          {
            ...rest,
            _id: newStoreDoc.insertedId,
            currency: currencies[country],

            userId: userId,
            storeDoc: {
              id: newStoreDoc.insertedId.toString(),
              storeFrontId: newStoreDoc.insertedId.toString(),
              country: country,
              city: city,
            },
            opened: false,
            balance: 0,

            coords,

            collections: [],
            image: '',
          },
          { session }
        );
      } else {
        throw new Error('wrong');
      }
    }
  };

  return await mainWrapperWithSession({
    ctx,
    callback,
    event,
    mainFunction,
    sessionPrefrences: transactionOptions,
  });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
