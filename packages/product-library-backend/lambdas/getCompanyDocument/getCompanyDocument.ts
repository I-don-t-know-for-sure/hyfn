"use strict";

import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { userId } = arg[0];

    result = await client
      .db("generalData")
      .collection("companyInfo")
      .findOne({ userId });

    return result === null ? {} : result;
  };
  return await mainWrapper({ event, ctx, mainFunction });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
