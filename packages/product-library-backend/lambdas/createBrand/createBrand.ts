"use strict";

import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { creatorId, brandInfo } = arg[0];

    const brandId = new ObjectId();
    await client
      .db("productsLibrary")
      .collection("brands")
      .insertOne({
        _id: brandId,
        creatorId,
        value: brandId.toString(),
        ...brandInfo,
      });

    return result;
  };
  return await mainWrapper({ event, ctx, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
