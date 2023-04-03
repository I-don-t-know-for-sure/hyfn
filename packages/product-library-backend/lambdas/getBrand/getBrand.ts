export const getBrandHandler = async ({ arg, client }) => {
  var result;
  const { brandId } = arg[0];
  const brand = await client
    .db("productsLibrary")
    .collection("brands")
    .findOne({ _id: new ObjectId(brandId) });
  result = brand;
  return result;
};
interface GetBrandProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getBrandHandler });
};
