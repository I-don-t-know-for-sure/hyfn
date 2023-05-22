export const updateStoreInfoHandler = async ({
  arg,
  client,
  db,
  userId: merchantId,
}: MainFunctionProps) => {
  var result;

  // const storeDoc = await client
  //   .db('generalData')
  //   .collection('storeInfo')
  //   .findOne({ usersIds: merchantId }, {});
  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', sql`array[${sql.join([merchantId])}]::uuid[]`)
    .executeTakeFirstOrThrow();
  if (!storeDoc) throw new Error('store not found');
  const country = storeDoc.country;

  const newInfo = arg[1];
  const { imgaeObj, userId, balance, ...newStore } = newInfo;

  const coordsArray = newStore.coords.split(',');

  if (Array.isArray(coordsArray)) {
    if (coordsArray.length === 2) {
      const float1 = parseFloat(coordsArray[0]);
      const float2 = parseFloat(coordsArray[1]);

      const coords = { type: 'Point', coordinates: [float2, float1] };

      await db
        .updateTable('stores')
        .set({
          lat: float1,
          long: float2,
          address: newStore.address,
          city: newStore.city,
          country: newStore.country,
          description: newStore.description,
          image: newStore.image,
          // currency: currencies[country],
          storeName: newStore.storeName,
          storePhone: newStore.storePhone,
          storeType: newStore.storeType,
          storeInfoFilled: true,
        })
        .where('usersIds', '@>', sql`array[${sql.join([merchantId])}]::uuid[]`)
        .execute();
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
import { sql } from 'kysely';
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: updateStoreInfoHandler,
  });
};
