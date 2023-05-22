export const getProductsForStoreHandler = async ({ arg, client, db }: MainFunctionProps) => {
  // return {
  //   statusCode: 200,
  //   body: "hello",
  // };
  const { id, city, country } = arg[0];
  const lastDocId = arg[1];
  const filter = arg[2];
  const isFiltered = Object.keys(filter).length === 1;
  const queryDoc =
    lastDocId && isFiltered
      ? {
          storeId: id,
          _id: { $gt: new ObjectId(lastDocId) },
          isActive: filter.active,
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
          isActive: filter.active,
          storeId: id,
        };

  const products = await db
    .selectFrom('products')
    .select(['id', 'title'])
    .where('storeId', '=', id)
    .execute();
  return products;
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
};
interface GetProductsForStoreProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getProductsForStoreHandler });
};
