interface GetStoreFrontsProps extends Omit<MainFunctionProps, 'arg'> {}
import { ObjectId } from 'mongodb';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

interface GetStoreFrontsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const getStoreFronts = async ({ arg, client, db }: GetStoreFrontsProps) => {
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
  const stores = await db
    .selectFrom('stores')
    .select(['storeName', 'description', 'image', 'id', 'storeType'])
    .limit(5)
    .execute();
  return stores;
  // const stores = await db.selectFrom('stores').selectAll().execute()
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getStoreFronts });
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
