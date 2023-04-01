interface GetCollectionsForProductProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { id, country, city } = arg[0];

    const storeDoc = await client
      .db('generalData')
      .collection(`storeInfo`)
      .findOne({ _id: new ObjectId(id) }, {});
    const reducedCollections = storeDoc.collections
      .filter((collection) => {
        return collection.collectionType !== 'automated';
      })
      .map((collection) => {
        console.log(JSON.stringify({ value: collection._id }));
        return { label: collection.textInfo.title, value: collection._id };
      });

    return reducedCollections;
  };
  return await mainWrapper({ event, ctx, mainFunction });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
