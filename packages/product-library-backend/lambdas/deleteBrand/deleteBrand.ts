export const deleteBrandHandler = async ({ arg, client }) => {
  var result;
  const { creatorId, brandId } = arg[0];
  await client
    .db("productsLibrary")
    .collection("brands")
    .deleteOne({ creatorId, _id: new ObjectId(brandId) });
  return result;
};
interface DeleteBrandProps extends Omit<MainFunctionProps, "arg"> {}
("use strict");
import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: deleteBrandHandler });
};
