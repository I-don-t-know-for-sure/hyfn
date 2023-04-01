interface GetProductsProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
"use strict";

import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { creatorId, lastProductId } = arg[0];

    if (lastProductId) {
      const products = await client
        .db("productsLibrary")
        .collection("products")
        .find({ creatorId, _id: { $gt: new ObjectId(lastProductId) } })
        .limit(15)
        .toArray();
      result = products;
      return;
    }
    const products = await client
      .db("productsLibrary")
      .collection("products")
      .find({ creatorId })
      .limit(15)
      .toArray();
    result = products;

    return result;
  };
  return await mainWrapper({ event, mainFunction });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
