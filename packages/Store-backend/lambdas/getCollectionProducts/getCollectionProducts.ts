export const getCollectionProductsHandler = async ({ arg, client }) => {
  var result;
  console.log(event);
  const { country, storeId, lastDoc, collectionId } = arg[0];
  if (lastDoc) {
    result = await client
      .db('base')
      .collection('products')
      .find(
        {
          '_id': { $gt: new ObjectId(lastDoc) },
          storeId,
          'collections.value': collectionId,
        },
        { projection: { _id: 1, textInfo: 1 } }
      )
      .limit(20)
      .toArray();
    result = result.map((product) => {
      return {
        value: product._id.toString(),
        label: product?.textInfo?.title,
      };
    });
    return;
  }
  result = await client
    .db('base')
    .collection('products')
    .find(
      {
        storeId,
        'collections.value': collectionId,
      },
      { projection: { _id: 1, textInfo: 1 } }
    )
    .limit(20)
    .toArray();
  result = result.map((product) => {
    return { value: product._id.toString(), label: product?.textInfo?.title };
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
