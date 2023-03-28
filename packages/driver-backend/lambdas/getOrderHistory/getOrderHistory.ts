'use strict';

import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

import { USER_STATUS_DELIVERED } from '../common/constants';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { driverId, country, lastDoc } = arg[0];

    if (lastDoc) {
      result = await client
        .db('base')
        .collection('orders')
        .find({
          _id: { $gt: new ObjectId(lastDoc) },
          status: { $elemMatch: { _id: driverId, status: USER_STATUS_DELIVERED } },
        })
        .limit(20)
        .toArray();
      return result;
    }

    result = await client
      .db('base')
      .collection('orders')
      .find({
        status: { $elemMatch: { _id: driverId, status: USER_STATUS_DELIVERED } },
      })
      .limit(20)
      .toArray();

    return result;
  };
  return await mainWrapper({ event, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
