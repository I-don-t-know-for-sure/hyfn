interface GetStoreFrontProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { ObjectId } from 'mongodb';
import { MainFunctionProps } from 'hyfn-server/src';
import { findOne, mainWrapper } from 'hyfn-server/src';
interface GetStoreFrontProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const getStoreFront = async ({ arg, client }: GetStoreFrontProps) => {
  const { city, country } = arg[0];
  const storeFrontId = arg[1];
  const storeFrontDoc = await client
    .db('base')
    .collection(`storeFronts`)
    .findOne(
      { _id: new ObjectId(storeFrontId) },
      {
        projection: {
          currentRatingTotal: 0,
          ownerFirstName: 0,
          ownerLastName: 0,
          ownerPhoneNumber: 0,
          storeOwnerInfoFilled: 0,
        },
      }
    );
  findOne({ findOneResult: storeFrontDoc });
  return storeFrontDoc;
  // Ensures that the client will close when you finish/error
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getStoreFront });
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
