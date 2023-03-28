"use strict";

import { MainFunctionProps, mainWrapper } from "hyfn-server";

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }: MainFunctionProps) => {
    var result;

    const { creatorId, productInfo } = arg[0];
    const { imagesURLs, ...rest } = productInfo;

    const productId = await client
      .db("productsLibrary")
      .collection("products")
      .insertOne({
        creatorId,
        ...rest,
        barcode: rest.barcode.trim(),

        images: imagesURLs,
      });
    result = productId.insertedId.toString();

    return result;
  };
  return await mainWrapper({ event, ctx, mainFunction });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
