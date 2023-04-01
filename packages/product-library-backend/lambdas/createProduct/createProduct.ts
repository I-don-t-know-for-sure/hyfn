export const createProductHandler = async ({
  arg,
  client,
}: MainFunctionProps) => {
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
interface CreateProductProps extends Omit<MainFunctionProps, "arg"> {}
("use strict");
import { MainFunctionProps, mainWrapper } from "hyfn-server";
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: createProductHandler });
};
