interface UpdateProductProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
"use strict";

import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const {
      creatorId,
      productId,
      newProductInfo: { imagesURLs, ...rest },
      deletedImages,
    } = arg[0];
    console.log(arg[0]);

    const oldProduct = await client
      .db("productsLibrary")
      .collection("products")
      .findOne({ _id: new ObjectId(productId) });
    const updatedImages = oldProduct?.images?.filter(
      (image) => !deletedImages?.some((deletedImage) => deletedImage === image)
    );
    console.log(oldProduct);
    const status = await client
      .db("productsLibrary")
      .collection("products")
      .updateOne(
        { _id: new ObjectId(productId) },
        {
          $set: {
            ...rest,
            barcode: rest.barcode.trim(),
            images: [...updatedImages, ...imagesURLs],
          },
        }
      );
    console.log(status, "shshshshssh");

    return result;
  };
  return await mainWrapper({ event, ctx, mainFunction });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
