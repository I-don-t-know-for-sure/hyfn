export const getCollectionStoreFrontProductsHandler = async ({
  arg,
  client,
}: MainFunctionProps) => {
  var result;
  const { country, storeId, collectionId } = arg[0];
  const storeFront = await client
    .db('base')
    .collection('storeFronts')
    .findOne({ id: new ObjectId(storeId) }, {});
  const key = Object.keys(storeFront).find((key) => storeFront[key]?.collectionId === collectionId);
  if (!key) {
    result = [];
    return;
  }
  const { products } = storeFront[key];
  result = products?.map((product) => {
    return { value: product.id, label: product.textInfo.title };
  });
  return result;
};
interface GetCollectionStoreFrontProductsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getCollectionStoreFrontProductsHandler });
};
