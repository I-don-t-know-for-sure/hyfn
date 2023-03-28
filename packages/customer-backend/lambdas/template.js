'use strict';

import client from './common/mongodb';
import { mainValidateFunction } from './common/authentication';
export const handler = async (event) => {
  var result;
  await client.connect();
  const arg = JSON.parse(event.body);
  const { accessToken, customerId } = arg[arg?.length - 1];
  await mainValidateFunction(client, accessToken, customerId);
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {}, {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    });
  } catch (error) {
    result = error.message;
  } finally {
    await session.endSession();

    return JSON.stringify(result);
  }

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
