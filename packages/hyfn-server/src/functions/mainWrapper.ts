"use strict";
// TODO use object as function parameter

import { cognitoAuthentication } from "./cognitoAuthentication";

import { _200, _402 } from "./api_Respones";
import { MainWrapperProps } from "./types";

import { getDb } from "./getDb";
import { log } from "console";

// import { mainValidateFunction } from './authentication';
export const mainWrapper = async ({
  event,
  mainFunction,

  validateUser = true
}: MainWrapperProps) => {
  try {
    var result;
    const arg = JSON.parse(event.body);

    const { accessToken, userId } = arg[arg.length - 1];
    console.log(process.env, "sjcjdcjdncjndjcnndjn");
    if (process.env.IS_LOCAL !== "true") {
      if (validateUser) {
        await cognitoAuthentication({
          accessToken,
          userId
        });
      }
    }
    const db = await getDb();

    result = await mainFunction({
      arg: [...arg],
      event,
      userId,
      accessToken,
      db
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
