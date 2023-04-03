export const getProductsForBulkUpdateHandler = async ({
  arg,
  client,
  userId,
}: MainFunctionProps) => {
  var products;
  const { id, city, country } = arg[0];
  const lastDocId = arg[1];
  const filter = arg[2];
  const ALL_PPRODUCTS = 'all';
  const filters = { active: true, inActive: false };
  const isFiltered = filter !== ALL_PPRODUCTS;
  const queryDoc =
    lastDocId && isFiltered
      ? {
          storeId: id,
          _id: { $gt: new ObjectId(lastDocId) },
          isActive: filters[filter],
        }
      : lastDocId && !isFiltered
      ? {
          storeId: id,
          _id: { $gt: new ObjectId(lastDocId) },
        }
      : !lastDocId && !isFiltered
      ? {
          storeId: id,
        }
      : {
          isActive: filters[filter],
          storeId: id,
        };
  console.log(JSON.stringify(queryDoc));
  products = await client
    .db('base')
    .collection(`products`)
    .find(queryDoc, {
      projection: {
        collections: 0,
        images: 0,
        storeId: 0,
        inventory: 0,
        shipping: 0,
        city: 0,
      },
    })
    .limit(10)
    .toArray();
  return products;
};
interface GetProductsForBulkUpdateProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, mainFunction: getProductsForBulkUpdateHandler });
};
