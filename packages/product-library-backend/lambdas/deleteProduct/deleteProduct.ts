export const deleteProductHandler = async ({ arg, client }) => {
  var result;
  const { creatorId, productId } = arg[0];
  await client
    .db("productsLibrary")
    .collection("products")
    .deleteOne({
      creatorId,
      _id: new ObjectId(productId),
    });
  return result;
};
interface DeleteProductProps extends Omit<MainFunctionProps, "arg"> {}
("use strict");
import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: deleteProductHandler });
};
