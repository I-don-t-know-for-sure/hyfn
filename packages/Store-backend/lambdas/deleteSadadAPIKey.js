'use strict';

import { mainValidateFunction } from './common/authentication';
import { ObjectId } from 'mongodb';
import { getMongoClientWithIAMRole } from './common/mongodb';
import { mainWrapperWithSession } from './common/mainWrapperWithSession';
import { updateOne } from './common/mongoUtils/updateOne';
export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client, session }) => {
    var result;
    const { country, id } = arg[0];
    await updateOne({
      query: { _id: new ObjectId(id) },
      update: {
        $set: {
          sadadApiKey: '',
          sadadFilled: false,
        },
      },
      options: { session },
      collection: client.db('generalData').collection('storeInfo'),
    });

    await updateOne({
      query: { _id: new ObjectId(id) },
      update: {
        $set: {
          sadadFilled: false,
        },
      },
      options: { session },
      collection: client.db('base').collection('storeFronts'),
    });

    return result;
  };
  return await mainWrapperWithSession({
    event,
    ctx,
    mainFunction,
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
