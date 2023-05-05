"use strict";
// TODO use object as function parameter
import { getMongoClientWithIAMRole } from "./mongodb";

import { cognitoAuthentication } from "./cognitoAuthentication";

import { _200, _402 } from "./api_Respones";
import { MainWrapperProps } from "./types";
import { getPostgresClient } from "./getPostgresClient";
// import { mainValidateFunction } from './authentication';
export const mainWrapper = async ({
  event,
  mainFunction,

  validateUser = true,
}: MainWrapperProps) => {
  try {
    console.log("🚀 ~ file: mainWrapper.js:17 ~ mainWrapper ~ userDocument");
    var result;
    const arg = JSON.parse(event.body);

    const client = await getMongoClientWithIAMRole();

    const { accessToken, userId } = arg[arg.length - 1];

    if (validateUser) {
      await cognitoAuthentication({
        accessToken,
        userId,
      });
    }

    result = await mainFunction({
      arg: [...arg],
      client,
      event,
      userId,
      accessToken,
      db: await getPostgresClient(),
    });
    result = _200(result);
  } catch (error: any) {
    console.log(error);
    result = _402(error.message);
  } finally {
    return result;
  }

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
