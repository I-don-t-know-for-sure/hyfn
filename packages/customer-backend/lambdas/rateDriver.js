'use strict';

import { ObjectId } from 'mongodb';

import { addRating } from './common/utils';

import { findOne } from '../common/mongoUtils/findOne';

import { mainWrapperWithSession } from '../common/mainWrapperWithSession';
import { updateOne } from '../common/mongoUtils/updateOne';
export const handler = async (event) => {
  const mainFunction = async ({ arg, session, client, event }) => {
    var result;

    const { newRating, customerId, orderId, country } = arg[0];

    const orderDoc = await findOne(
      {
        _id: new ObjectId(orderId),
      },
      { session },
      client.db('base').collection('orders')
    );
    const { _id: driverId } = orderDoc.status.find((status) => {
      return status.driver;
    });
    await updateOne({
      query: {
        _id: new ObjectId(orderId),
      },
      update: {
        $set: { driverRating: newRating },
      },
      options: { session },
      collection: client.db('base').collection('orders'),
    });

    await updateOne({
      query: {
        _id: driverId,
      },
      update: {
        $push: {
          ratings: { customerId, rating: newRating },
        },
      },
      options: { session, upsert: true },
      collection: client.db('generalData').collection('driverInfo'),
    });

    const { currentRatingTotal: oldCurrentRatingTotal = 0, ratingCount: oldRatingCount = 0 } =
      await findOne(
        { _id: new Object(driverId) },
        {},
        client.db('generalData').collection('driverData')
      );

    const { currentRating, currentRatingTotal, ratingCount } = addRating(
      oldCurrentRatingTotal,
      oldRatingCount,
      newRating
    );

    await updateOne({
      query: {
        driverId: driverId,
      },
      update: {
        $set: {
          currentRating,
          currentRatingTotal,
          ratingCount,
        },
      },
      options: {},
      collection: client.db('generalData').collection('driverData'),
    });
    result = 'rating successful';

    return result;
  };
  return await mainWrapperWithSession({
    mainFunction,

    event,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
