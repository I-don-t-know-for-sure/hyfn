interface GetProductsForStoreProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';
import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var products;

    // return {
    //   statusCode: 200,
    //   body: "hello",
    // };

    const { id, city, country } = arg[0];
    const lastDocId = arg[1];
    const filter = arg[2];

    const isFiltered = Object.keys(filter).length === 1;

    const queryDoc =
      lastDocId && isFiltered
        ? {
            storeId: id,
            _id: { $gt: new ObjectId(lastDocId) },
            isActive: filter.active,
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
            isActive: filter.active,
            storeId: id,
          };

    console.log(JSON.stringify(queryDoc));
    products = await client
      .db('base')
      .collection(`products`)
      .find(queryDoc, {
        projection: { _id: 1, textInfo: 1 },
      })
      .limit(6)
      .toArray();

    return products;

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  };
  return await mainWrapper({ event, ctx, mainFunction });
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
