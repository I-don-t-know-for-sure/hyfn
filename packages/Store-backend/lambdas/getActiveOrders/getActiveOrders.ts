'use strict';

import { ObjectId } from 'mongodb';

import {
  ORDER_STATUS_DELIVERED,
  ORDER_TYPE_PICKUP,
  USER_TYPE_DRIVER,
  USER_TYPE_STORE,
} from '../resources';
import { mainWrapper } from 'hyfn-server';
export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    const { status, city, country, id, lastDoc } = arg[0];

    const db = client.db('base');
    if (lastDoc) {
      const orders = await db
        .collection(`orders`)
        .find({
          _id: { $gt: new ObjectId(lastDoc) },

          canceled: { $exists: false },
          $or: [
            {
              $and: [
                {
                  status: {
                    $elemMatch: {
                      _id: new ObjectId(id),
                      userType: USER_TYPE_STORE,
                      status: { $ne: ORDER_STATUS_DELIVERED },
                    },
                  },
                },
                {
                  status: {
                    $elemMatch: {
                      userType: USER_TYPE_DRIVER,
                      _id: { $ne: '' },
                    },
                  },
                },
              ],
            },
            { orderType: ORDER_TYPE_PICKUP },
          ],
        })
        .limit(20)
        .toArray();
      return orders;
    }
    const orders = await db
      .collection(`orders`)
      .find({
        canceled: { $exists: false },
        $or: [
          {
            $and: [
              {
                status: {
                  $elemMatch: {
                    _id: new ObjectId(id),
                    userType: USER_TYPE_STORE,
                    status: { $ne: ORDER_STATUS_DELIVERED },
                  },
                },
              },
              // {
              //   status: {
              //     $elemMatch: {
              //       userType: USER_TYPE_DRIVER,
              //       _id: { $ne: '' },
              //     },
              //   },
              // },
            ],
          },
          {
            $and: [
              {
                status: {
                  $elemMatch: {
                    _id: new ObjectId(id),
                    userType: USER_TYPE_STORE,
                    status: { $ne: ORDER_STATUS_DELIVERED },
                  },
                },
              },
              { orderType: ORDER_TYPE_PICKUP },
            ],
          },
        ],
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
