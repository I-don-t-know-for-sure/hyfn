'use strict';

import { mainValidateFunction } from './common/authentication';
import { getMongoClientWithIAMRole } from './common/mongodb';
export const handler = async (event) => {
  var result;
  const client = await getMongoClientWithIAMRole();
  const arg = JSON.parse(event.body);
  const { country, searchType = 'product', searchValue } = arg[0];
  const { accessToken, customerId } = arg[1];
  await mainValidateFunction(client, accessToken, customerId);
  try {
    const agg = [
      {
        $search: {
          index: 'defaulproductSearch',
          text: {
            query: searchValue,
            path: {
              wildcard: '*',
            },
          },
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 1,
          textInfo: 1,
        },
      },
    ];

    if (searchType === 'product') {
      const coll = client.db('base').collection('products');
      result = await coll.aggregate(agg).toArray();
      return;
    } else {
      const coll = client.db();
      return;
    }
  } catch (error) {
    result = error.message;
  } finally {
    return JSON.stringify(result);
  }

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
