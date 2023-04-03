interface GetProductProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  const getProductfunction = async ({ arg, client }) => {
    const { productId } = arg[0];
    const product = await client
      .db("productsLibrary")
      .collection("products")
      .findOne(
        { _id: new ObjectId(productId) },
        {
          projection: {
            _id: 0,
            creatorId: 0,
          },
        }
      );
    return product;
  };
  const result = await mainWrapper({ event, mainFunction: getProductfunction });
  // Ensures that the client will close when you finish/error
  return result;
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
