interface CreateLocalCardTransactionForWalletProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}

import { ObjectId } from 'mongodb';
import { adminName, TRANSACTION_TYPE_WALLET } from 'hyfn-types';
import { getAdminLocalCardCreds } from './common/getAdminLocalCardCreds';
import { createLocalCardConfigurationObject, MainFunctionProps, mainWrapper } from 'hyfn-server';
const createLocalCardTransactionForWallet = async ({ arg, client }) => {
  const { userId, amount } = arg[0];
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
      type: TRANSACTION_TYPE_WALLET,
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
    includeLocalCardTransactionFeeToPrice: true,
    secretKey,
    now,
    MerchantId,
    TerminalId,
    amount,
    transactionId,
  });
  return { configurationObject };
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createLocalCardTransactionForWallet });
};
