interface CreateUserDocumentProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { MainFunctionProps } from 'hyfn-server/src';
import { insertOne, mainWrapper } from 'hyfn-server/src';
interface CreateUserDocumentProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const createUserDocument = async ({ arg, client, userId }: MainFunctionProps) => {
  var result;
  const { country, ...customerInfo } = arg[0];
  const insertCustomerResult = await client.db('generalData').collection('customerInfo').insertOne({
    customerId: userId,
    name: customerInfo.name,
  });
  insertOne({ insertOneResult: insertCustomerResult });
  result = 'success';
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createUserDocument });
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
