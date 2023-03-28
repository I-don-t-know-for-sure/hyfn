'use strict';

import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { storeId, country, productsArray } = arg[0];

    const validatedArray = productsArray;

    // schema validations

    const updateQuery = validatedArray?.map((product) => {
      const { _id, ...rest } = product;
      const options = rest.options.options;
      return {
        updateOne: {
          filter: {
            _id: new ObjectId(product._id),
          },
          update: {
            $set: {
              options: {
                hasOptions: options.length > 0,
                options,
              },
            },
          },
        },
      };
    });
    console.log(updateQuery);
    await client.db('base').collection('products').bulkWrite(updateQuery);

    return result;
  };
  return await mainWrapper({ event, ctx, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
