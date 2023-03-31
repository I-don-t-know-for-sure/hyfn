'use strict';

import { ObjectId } from 'mongodb';

import { ORDER_STATUS_DELIVERED } from '../resources';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }: MainFunctionProps) => {
    const { status, city, country, id, lastDoc } = arg[0];
    const db = client.db('base');
    if (lastDoc) {
      const orders = await db
        .collection(`orders`)
        .find({
          _id: { $gt: new ObjectId(lastDoc) },
          status: {
            $elemMatch: {
              status: { $eq: ORDER_STATUS_DELIVERED },
              _id: new ObjectId(id),
              userType: 'store',
            },
          },
        })
        .limit(20)
        .toArray();

      console.log(JSON.stringify(orders));

      return orders;
    }

    const orders = await db
      .collection(`orders`)
      .find({
        status: {
          $elemMatch: {
            status: { $eq: ORDER_STATUS_DELIVERED },
            _id: new ObjectId(id),
            userType: 'store',
          },
        },
      })
      .limit(20)
      .toArray();

    console.log(JSON.stringify(orders));

    return orders;
  };
  return await mainWrapper({ event, ctx, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};