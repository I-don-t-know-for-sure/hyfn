export const getCollectionHandler = async ({ arg, client }: MainFunctionProps) => {
  const { city, country, id } = arg[0];
  const collectionId = arg[1];
  // await argValidations(arg);
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ _id: new ObjectId(id) }, {});
  const collection = storeDoc.collections?.find((collection) => collection._id === collectionId);
  console.log(JSON.stringify(collection));
  return collection;
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
interface GetCollectionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getCollectionHandler });
};
