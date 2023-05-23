export const getBrandsHandler = async ({ arg, client }) => {
  var result;
  const { creatorId, lastBrandId } = arg[0];
  if (lastBrandId) {
    const products = await client
      .db("productsLibrary")
      .collection("brands")
      .find({ creatorId, id: { $gt: new ObjectId(lastBrandId) } })
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
interface GetBrandsProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");
import { mainWrapper, _200, MainFunctionProps } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getBrandsHandler });
};
