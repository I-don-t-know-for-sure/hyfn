interface CreateLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import { HmacSHA256 } from 'crypto-js';
import { adminName, subscriptionCost, TRANSACTION_TYPE_SUBSCRIPTION } from '../resources';
import { getAdminLocalCardCreds } from '../common/getAdminLocalCardCreds';
import {
  createLocalCardConfigurationObject,
  hex_to_ascii,
  MainFunctionProps,
  mainWrapper,
} from 'hyfn-server';
const createLocalCardTransaction = async ({ arg, client }) => {
  const { userId, numberOfMonths } = arg[0];
  const amount = numberOfMonths * subscriptionCost;
  if (amount === undefined) {
    throw 'order data not found';
  }
  const transactionId = new ObjectId();
  const now = new Date();
  await client.db('generalData').collection('transactions').insertOne(
    {
      _id: transactionId,
      customerId: userId,
      amount,
      storeId: adminName,
      transactionDate: now,
      transactionType: TRANSACTION_TYPE_SUBSCRIPTION,
      validated: false,
    },
    {}
  );
  const { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();
  console.log(
    '🚀 ~ file: createLocalCardTransaction.js:30 ~ createLocalCardTransaction ~ secretKey',
    secretKey
  );

  const configurationObject = createLocalCardConfigurationObject({
    amount,
    includeLocalCardTransactionFeeToPrice: true,
    MerchantId,
    now,
    secretKey,
    TerminalId,
    transactionId,
  });
  return { configurationObject };
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createLocalCardTransaction });
};
