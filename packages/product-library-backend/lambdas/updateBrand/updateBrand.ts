export const updateBrandHandler = async ({ arg, client }) => {
  var result;
  const { creatorId, brandId, newBrandInfo } = arg[0];
  await client
    .db("productsLibrary")
    .collection("brands")
    .updateOne(
      { creatorId, id: new ObjectId(brandId) },
      {
        $set: {
          ...newBrandInfo,
        },
      }
    );
  return result;
};
interface UpdateBrandProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: updateBrandHandler });
};
