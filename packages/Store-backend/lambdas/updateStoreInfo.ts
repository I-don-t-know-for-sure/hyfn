export const updateStoreInfoHandler = async ({
  arg,
  client,

  userId: merchantId,
}: MainFunctionProps) => {
  var result;

  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ usersIds: merchantId }, {});
  if (!storeDoc) throw new Error('store not found');
  const country = storeDoc.country;

  const newInfo = arg[1];
  const { imgaeObj, userId, balance, ...newStore } = newInfo;

  const mongo = client.db('base');
  const storeCollection = client.db('generalData').collection(`storeInfo`);
  const storeFrontCollection = mongo.collection(`storeFronts`);

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
            ...(storeDoc.opened ? {} : { coords: coords }),
          },
        },
        {}
      );
    }
  }
  return result;
};
interface UpdateStoreInfoProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { ObjectId } from 'mongodb';
import { currencies } from 'hyfn-types';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: updateStoreInfoHandler,
  });
};
