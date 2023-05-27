interface GetStoreFrontsProps extends Omit<MainFunctionProps, 'arg'> {}
import { ObjectId } from 'mongodb';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { sql } from 'kysely';

interface GetStoreFrontsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const getStoreFronts = async ({ arg, client, db }: GetStoreFrontsProps) => {
  const { country, city, coords, nearby, filter: storeType, lastDocNumber } = arg[0];

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
  var qb = db
    .selectFrom('stores')
    .select(['storeName', 'description', 'image', 'id', 'storeType'])
    .limit(5);
  if (!!storeType && storeType !== 'all') {
    qb = qb.where('storeType', '@>', [storeType]);
  }
  // if(nearby){
  //   qb.where(sql``)
  // }
  const stores = qb.execute();
  return stores;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getStoreFronts });
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
