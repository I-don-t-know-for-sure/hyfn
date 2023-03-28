'use strict';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

import { ObjectId } from 'mongodb';

export const handler = async (event, ctx) => {
  const mainFunction = async ({
    arg,
    client,

    userId,
  }: MainFunctionProps) => {
    var products;

    const { id, city, country } = arg[0];
    const lastDocId = arg[1];
    const filter = arg[2];
    const ALL_PPRODUCTS = 'all';
    const filters = { active: true, inActive: false };
    const isFiltered = filter !== ALL_PPRODUCTS;

    const queryDoc =
      lastDocId && isFiltered
        ? {
            storeId: id,
            _id: { $gt: new ObjectId(lastDocId) },
            isActive: filters[filter],
          }
        : lastDocId && !isFiltered
        ? {
            storeId: id,
            _id: { $gt: new ObjectId(lastDocId) },
          }
        : !lastDocId && !isFiltered
        ? {
            storeId: id,
          }
        : {
            isActive: filters[filter],
            storeId: id,
          };

    console.log(JSON.stringify(queryDoc));
    products = await client
      .db('base')
      .collection(`products`)
      .find(queryDoc, {
        projection: {
          collections: 0,
          images: 0,
          storeId: 0,
          inventory: 0,
          shipping: 0,

          city: 0,
        },
      })
      .limit(10)
      .toArray();

    return products;
  };

  return await mainWrapper({ event, mainFunction });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
