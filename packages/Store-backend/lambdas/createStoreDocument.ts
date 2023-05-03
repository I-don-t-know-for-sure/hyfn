('use strict');
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
import { currencies, gibbrish } from 'hyfn-types';
interface CreateStoreDocumentProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const createStoreDocumentHandler = async ({
  arg,
  client,

  userId,
}: MainFunctionProps) => {
  const session = client.startSession();
  const response = await withTransaction({
    session,
    fn: async () => {
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
      const storeFronts = mongo.db('base').collection(`storeFronts`);
      const customUserData = mongo.db('generalData').collection('storeInfo');
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
              ////////
              usersIds: [userId],
              users: {
                [userId]: {
                  userType: 'owner',
                },
              },
              /////////
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
    },
  });
  await session.endSession();
  return response;
};
export const handler = async (event, ctx, callback) => {
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  return await mainWrapper({
    ctx,
    callback,
    event,
    mainFunction: createStoreDocumentHandler,
    sessionPrefrences: transactionOptions,
  });
};
