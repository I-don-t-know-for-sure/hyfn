('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { currencies, gibbrish } from 'hyfn-types';
import { re } from 'mathjs';
interface CreateStoreDocumentProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const createStoreDocumentHandler = async ({
  arg,

  db,
  userId,
}: MainFunctionProps) => {
  const storeInfo = arg[0];
  console.log('🚀 ~ file: createStoreDocument.ts:15 ~ storeInfo:', storeInfo);
  const storeName = storeInfo.storeName;
  const storeType = storeInfo.storeType.includes('Restaurant')
    ? ['Restaurant']
    : storeInfo.storeType;
  const storePhone = storeInfo.storePhone;
  const country = storeInfo.country;
  const city = storeInfo.city;
  const { coords, ...rest } = storeInfo;

  const coordsArray = coords.split(',');
  if (Array.isArray(coordsArray)) {
    if (coordsArray.length === 2) {
      const float1 = parseFloat(coordsArray[0]);
      const float2 = parseFloat(coordsArray[1]);
      const coords = { type: 'Point', coordinates: [float2, float1] };

      await db
        .insertInto('stores')
        .values({
          notificationTokens: [],
          acceptingOrders: false,
          address: rest.address,
          balance: 0,
          lat: float1,
          long: float2,
          userId: userId,
          city: city,
          country: country,
          opened: false,
          image: [],
          usersIds: [userId],
          users: [{ userType: 'owner', userId: userId }],
          storeName: storeName,
          description: rest.description,
          storeType: storeType,
          storePhone: storePhone,

          monthlySubscriptionPaid: false,
        })
        .executeTakeFirst();
    } else {
      throw new Error('wrong');
    }
  }
};
export const handler = async (event, ctx, callback) => {
  return await mainWrapper({
    ctx,
    callback,
    event,
    mainFunction: createStoreDocumentHandler,
  });
};
