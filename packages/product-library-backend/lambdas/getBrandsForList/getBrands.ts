interface GetBrandsProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
"use strict";

import { mainWrapper } from "hyfn-server";

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { creatorId, lastBrandId } = arg[0];

    const products = await client
      .db("productsLibrary")
      .collection("brands")
      .find(
        { creatorId },
        {
          projection: {
            _id: 0,
            description: 0,
            creatorId: 0,
          },
        }
      )

      .toArray();
    result = products;

    return result;
  };
  return await mainWrapper({ event, ctx, mainFunction });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
