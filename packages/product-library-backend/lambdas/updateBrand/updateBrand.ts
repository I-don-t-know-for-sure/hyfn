export const updateBrandHandler = async ({ arg, client }) => {
  var result;
  const { creatorId, brandId, newBrandInfo } = arg[0];
  await client
    .db("productsLibrary")
    .collection("brands")
    .updateOne(
      { creatorId, _id: new ObjectId(brandId) },
      {
        $set: {
          ...newBrandInfo,
        },
      }
    );
  return result;
};
interface UpdateBrandProps extends Omit<MainFunctionProps, "arg"> {}
("use strict");
import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: updateBrandHandler });
};
