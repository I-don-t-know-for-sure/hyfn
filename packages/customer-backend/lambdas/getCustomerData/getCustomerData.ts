'use strict';

import { MainFunctionProps } from 'hyfn-server';
import { findOne, mainWrapper } from 'hyfn-server';

interface GetCustomerDataProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const getCustomerData = async ({
  arg,
  session,
  client,
  event,
  userId,
}: GetCustomerDataProps) => {
  console.log(process.env);
  const mongo = client;
  const customerDoc = await mongo
    .db('generalData')
    .collection('customerInfo')
    .findOne({ customerId: userId });
  findOne({ findOneResult: customerDoc });

  return customerDoc;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getCustomerData });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
