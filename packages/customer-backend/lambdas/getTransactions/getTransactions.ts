'use strict';

import { ObjectId } from 'mongodb';
import { mainWrapper } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';
interface GetTransactionsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
const getTransactions = async ({ arg, client }: GetTransactionsProps) => {
  const { customerId, lastDoc } = arg[0];
  if (lastDoc) {
    const transactions = await client
      .db('generalData')
      .collection('transactions')
      .find({
        _id: { $gt: new ObjectId(lastDoc) },
        customerId,
      })
      .limit(20)
      .toArray();
    return transactions;
  }

  const transactions = await client
    .db('generalData')
    .collection('transactions')
    .find({
      customerId,
    })
    .limit(20)
    .toArray();
  return transactions;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getTransactions });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
