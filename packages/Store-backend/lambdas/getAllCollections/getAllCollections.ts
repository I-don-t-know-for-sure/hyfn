'use strict';

import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    console.log(event);

    console.log(arg);
    const { id, country, city } = arg[0];
    console.log('🚀 ~ file: getAllCollections.js ~ line 15 ~ mainFunction ~ id', id);

    // await argValidations(arg);

    const storeDoc = await client
      .db('generalData')
      .collection(`storeInfo`)
      .findOne({ _id: new ObjectId(id) }, {});

    return storeDoc.collections;
  };
  return await mainWrapper({ event, ctx, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
