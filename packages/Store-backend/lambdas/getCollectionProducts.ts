export const getCollectionProductsHandler = async ({ arg, client, db }: MainFunctionProps) => {
  var result;

  const { lastDoc, collectionId } = arg[0];

  const products = await db
    .selectFrom('collectionsProducts')
    .where('collectionId', '=', collectionId)
    .innerJoin('products', 'collectionsProducts.productId', 'products.id')
    .select(['products.id', 'products.title'])
    .offset(lastDoc > 0 ? lastDoc : 0)
    .limit(20)
    .execute();

  result = products.map((product) => {
    return {
      value: product.id,
      label: product?.title,
    };
  });
  return result;
};
interface GetCollectionProductsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getCollectionProductsHandler });
};
