interface GetStoreFrontsProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { ObjectId } from 'mongodb';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { storeFrontSchema, test4 } from 'hyfn-types';
import { z } from 'zod';
interface GetStoreFrontsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const getStoreFronts = async ({ arg, client }: GetStoreFrontsProps) => {
  console.log('🚀 ~ file: getStoreFronts.ts:4 ~ test4:', test4);
  console.log('🚀 ~ file: getStoreFronts.ts:4 ~ test4:', test4);
  console.log('🚀 ~ file: getStoreFronts.ts:4 ~ test4:', test4);
  console.log('🚀 ~ file: getStoreFronts.ts:4 ~ test4:', test4);
  console.log('🚀 ~ file: getStoreFronts.ts:4 ~ test4:', test4);
  console.log('🚀 ~ file: getStoreFronts.ts:4 ~ test4:', test4);

  const { country, city, coords, nearby } = arg[0];
  const { filter: storeType } = arg[1];
  const lastDoc = arg[2];

  const query =
    nearby && storeType !== 'all'
      ? {
          storeType: storeType,
          city,
          coords: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [coords[1], coords[0]],
              },
              $maxDistance: 10000,
            },
          },
        }
      : !nearby && storeType !== 'all'
      ? { storeType, city }
      : nearby && storeType === 'all'
      ? {
          city,
          coords: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [coords[1], coords[0]],
              },
              $maxDistance: 10000,
            },
          },
        }
      : {
          city,
        };
  type Store = z.infer<typeof storeFrontSchema>;
  console.log('🚀 ~ file: getStoreFronts.js:14 ~ mainFunction ~ query', city);
  if (lastDoc) {
    const stores = await client
      .db('base')
      .collection(`storeFronts`)
      .find<Store>(
        { ...query, _id: { $gt: new ObjectId(lastDoc) } },
        {
          projection: {
            description: 1,
            currentRating: 1,
            _id: true,
            image: 1,
            storeName: true,
            businessName: 1,
            ratingCount: 1,
            country: true,
            city: 1,
          },
        }
      )
      .limit(20)
      .toArray();

    return stores;
  }
  const stores = await client
    .db('base')
    .collection(`storeFronts`)
    .find(query, {
      projection: {
        description: 1,
        currentRating: 1,
        _id: true,
        image: 1,
        storeName: true,
        businessName: 1,
        ratingCount: 1,
        country: true,
        city: 1,
      },
    })
    .limit(20)
    .toArray();

  return stores;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getStoreFronts });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
