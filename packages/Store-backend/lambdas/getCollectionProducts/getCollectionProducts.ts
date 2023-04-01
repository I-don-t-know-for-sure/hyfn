interface GetCollectionProductsProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
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
  return await mainWrapper({ event, ctx, mainFunction });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
