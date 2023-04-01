interface GetBrandProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
"use strict";

import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { brandId } = arg[0];

    const brand = await client
      .db("productsLibrary")
      .collection("brands")
      .findOne({ _id: new ObjectId(brandId) });
    result = brand;

    return result;
  };
  return await mainWrapper({ event, ctx, mainFunction });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
