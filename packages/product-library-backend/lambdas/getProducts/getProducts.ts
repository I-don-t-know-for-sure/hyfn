export const getProductsHandler = async ({ arg, client }) => {
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
interface GetProductsProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, mainFunction: getProductsHandler });
};
