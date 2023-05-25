interface GetProductProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { ObjectId } from 'mongodb';
import { MainFunctionProps } from 'hyfn-server/src';
import { mainWrapper } from 'hyfn-server/src';
interface GetProductProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
const getProduct = async ({ arg, client, db }: GetProductProps) => {
  var result;
  const { storefront, productId, city, country } = arg[0];
  const withStoreDoc = arg[1];

  if (withStoreDoc) {
    const storeDoc = await db
      .selectFrom('stores')
      .selectAll()
      .where('id', '=', storefront)
      .executeTakeFirstOrThrow();
    const product = await db
      .selectFrom('products')
      .selectAll()
      .where('id', '=', productId)
      .executeTakeFirstOrThrow();

    result = { product, storeDoc };
    return result;
  }
  const product = await db
    .selectFrom('products')
    .selectAll()
    .where('id', '=', productId)
    .executeTakeFirstOrThrow();

  result = product;
  return result;
  // Ensures that the client will close when you finish/error
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getProduct });
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
