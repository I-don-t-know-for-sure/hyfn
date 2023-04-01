interface GetBrandsProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
"use strict";

import { mainWrapper, _200 } from "hyfn-server";
import { ObjectId } from "mongodb";

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { creatorId, lastBrandId } = arg[0];

    if (lastBrandId) {
      const products = await client
        .db("productsLibrary")
        .collection("brands")
        .find({ creatorId, _id: { $gt: new ObjectId(lastBrandId) } })
        .limit(15)
        .toArray();
      result = products;
      return result;
    }
    const products = await client
      .db("productsLibrary")
      .collection("brands")
      .find({ creatorId })
      .limit(15)
      .toArray();
    result = products;

    return result;
  };
  return await mainWrapper({ event, ctx, mainFunction });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
