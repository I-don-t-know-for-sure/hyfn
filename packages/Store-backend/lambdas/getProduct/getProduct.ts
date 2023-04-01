export const getProductHandler = async ({ arg, client, userId }: MainFunctionProps) => {
  // await subscriptionCheck({ storedoc: userDocument, client, storeId: userDocument._id });
  var result;
  const { id, city, country } = arg[0];
  const productId = arg[1];
  console.log(productId);
  result = await client
    .db('base')
    .collection(`products`)
    .findOne({ _id: new ObjectId(productId) }, {});
  return result;
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
interface GetProductProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { subscriptionCheck } from '../common/subscriptionCheck';
export const handler = async (event, ctx, callback) => {
  return await mainWrapper({ event, ctx, mainFunction: getProductHandler });
};
