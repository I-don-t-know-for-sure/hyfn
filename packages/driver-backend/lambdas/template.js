'use strict';

import { ObjectId } from 'mongodb';
import { mainValidateFunction } from './common/authentication';
import client from './common/mongodb';

export const handler = async (event) => {
  var result;
  await client.connect();
  const arg = JSON.parse(event.body);
  const { accessToken, userId } = arg[arg?.length - 1];
  await mainValidateFunction(client, accessToken, userId);
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {}, {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    });
  } catch (error) {
    const { message } = error;
    result = message;
  } finally {
    await session.endSession();

    return JSON.stringify(result);
  }

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
