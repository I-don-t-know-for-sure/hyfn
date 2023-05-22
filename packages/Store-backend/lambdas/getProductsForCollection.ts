export const getProductsForCollectionHandler = async ({ arg, client, db }: MainFunctionProps) => {
  var result;
  const { country, storeId, collectionId, lastDoc } = arg[0];
  // if (lastDoc) {
  //   result = await client
  //     .db('base')
  //     .collection('products')
  //     .find(
  //       {
  //         '_id': { $gt: new ObjectId(lastDoc) },
  //         storeId,
  //         'collections.value': { $ne: collectionId },
  //       },
  //       {
  //         projection: {
  //           _id: 1,
  //           textInfo: 1,
  //         },
  //       }
  //     )
  //     .limit(20)
  //     .toArray();
  //   result = result.map((product) => {
  //     return { value: product._id.toString(), label: product.textInfo.title };
  //   });
  //   return;
  // }
  // result = await client
  //   .db('base')
  //   .collection('products')
  //   .find(
  //     { storeId, 'collections.value': { $ne: collectionId } },
  //     {
  //       projection: {
  //         _id: 1,
  //         textInfo: 1,
  //       },
  //     }
  //   )
  //   .limit(20)
  //   .toArray();
  const product = await db
    .selectFrom('products')
    .select(['id', 'title'])
    .where('storeId', '=', storeId)
    .limit(5)
    .execute();
  result = product.map((product) => {
    return { value: product.id, label: product.title };
  });
  return result;
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
};
interface GetProductsForCollectionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getProductsForCollectionHandler });
};
