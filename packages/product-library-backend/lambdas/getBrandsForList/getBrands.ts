export const getBrandsHandler = async ({ arg, client }) => {
  var result;
  const { creatorId, lastBrandId } = arg[0];
  const products = await client
    .db("productsLibrary")
    .collection("brands")
    .find(
      { creatorId },
      {
        projection: {
          id: 0,
          description: 0,
          creatorId: 0,
        },
      }
    )
    .toArray();
  result = products;
  return result;
};
interface GetBrandsProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");
import { MainFunctionProps, mainWrapper } from "hyfn-server";
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getBrandsHandler });
};
