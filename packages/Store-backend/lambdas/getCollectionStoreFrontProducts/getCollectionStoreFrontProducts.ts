interface GetCollectionStoreFrontProductsProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { country, storeId, collectionId } = arg[0];

    const storeFront = await client
      .db('base')
      .collection('storeFronts')
      .findOne({ _id: new ObjectId(storeId) }, {});

    const key = Object.keys(storeFront).find(
      (key) => storeFront[key]?.collectionId === collectionId
    );
    if (!key) {
      result = [];
      return;
    }
    const { products } = storeFront[key];

    result = products?.map((product) => {
      return { value: product._id, label: product.textInfo.title };
    });

    return result;
  };
  return await mainWrapper({ event, ctx, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
