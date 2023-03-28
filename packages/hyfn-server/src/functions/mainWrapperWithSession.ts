'use strict';
import { _200, _402 } from './api_Respones';
// TODO use object as function parameter

import { cognitoAuthentication } from './cognitoAuthentication';
// import { mainValidateFunction } from "./authentication";
import { getMongoClientWithIAMRole } from './mongodb';
import { MainWrapperProps } from './types';
export const mainWrapperWithSession = async ({
  ctx,
  callback,
  event,
  mainFunction,
  sessionPrefrences = { readConcern: 'local', writeConcern: { w: 'majority' } },
  withUserDocument,
  projection = { _id: 1, customerId: 1 },
  validateUser = true,
}: MainWrapperProps) => {
  // turnOffCallbackAwaitForEmptyEventLoop(ctx);
  const client = await getMongoClientWithIAMRole();
  var session = client.startSession();
  try {
    console.log('🚀 ~ file: mainWrapperWithSession.js:21 ~ sessionPrefrences', sessionPrefrences);

    console.log('🚀 ~ file: mainWrapperWithSession.js:16 ~ event', event);

    // var session = client.startSession({ readPreference: sessionPrefrences.readPreference });
    var result;
    const arg = JSON.parse(event.body);

    const { accessToken, userId } = arg[arg.length - 1];
    if (validateUser) {
      await cognitoAuthentication({
        accessToken,
        userId,
      });
    }

    // session.startTransaction({
    //   readConcern: sessionPrefrences.readConcern,
    //   writeConcern: sessionPrefrences.writeConcern,
    // });
    // result = await mainFunction({
    //   arg,
    //   client,
    //   session,
    //   event,
    //   ctx,
    //   callback,
    //   userDocument: { ...userDocument, customerId: userId },
    // });
    await session.withTransaction(async () => {
      result = await mainFunction({
        arg,
        client,
        session,
        event,
        ctx,
        callback,
        userId,
      });
    }, sessionPrefrences);
    // const commitResult = await session.commitTransaction();
    // console.log('🚀 ~ file: mainWrapperWithSession.js:61 ~ commitResult', commitResult);
    result = _200(result);
  } catch (error: any) {
    console.log('🚀 ~ file: mainWrapperWithSession.js:64 ~ error', error);
    result = _402(error.message);
    // await session.abortTransaction();
  } finally {
    await session.endSession();

    return result;
  }

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
