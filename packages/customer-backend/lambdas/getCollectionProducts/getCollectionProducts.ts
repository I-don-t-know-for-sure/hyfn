interface GetCollectionProductsProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { ObjectId } from 'mongodb';
import { mainWrapper } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';

interface GetCollectionProductsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const getCollectionProducts = async ({ arg, client }: GetCollectionProductsProps) => {
  var result;

  const { country, storefront, collectionid, documents = 25 } = arg[0];
  const lastDoc = arg[1];

  if (lastDoc) {
    result = await client
      .db('base')
      .collection('products')
      .find({
        '_id': { $gt: new ObjectId(lastDoc) },
        'storeId': storefront,
        'collections.value': collectionid,
        'isActive': true,
      })
      .limit(documents)
      .toArray();
    console.log('🚀 ~ file: getCollectionProducts.js:28 ~ mainFunction ~ result', result);
    return result;
  }

  result = await client
    .db('base')
    .collection('products')
    .find({
      'storeId': storefront,
      'collections.value': collectionid,
      'isActive': true,
    })
    .limit(documents)
    .toArray();
  console.log(result);
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getCollectionProducts });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
