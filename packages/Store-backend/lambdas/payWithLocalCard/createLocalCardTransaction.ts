interface CreateLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import { HmacSHA256 } from 'crypto-js';
import { adminName, subscriptionCost, TRANSACTION_TYPE_SUBSCRIPTION } from '../resources';
import { getAdminLocalCardCreds } from '../common/getAdminLocalCardCreds';
import { hex_to_ascii, MainFunctionProps, mainWrapper } from 'hyfn-server';
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
    secretKey,
    now,
    MerchantId,
    TerminalId,
    amount,
    transactionId,
  });
  return { configurationObject };
};
function createLocalCardConfigurationObject({
  secretKey,
  now,
  MerchantId,
  TerminalId,
  amount,
  transactionId,
}) {
  console.log('🚀 ~ file: createLocalCardTransaction.js:50 ~ secretKey', secretKey);
  const merchantKey = hex_to_ascii(secretKey);
  const strHashData = `Amount=${
    amount * 1000
  }&DateTimeLocalTrxn=${now.getTime()}&MerchantId=${MerchantId}&MerchantReference=${transactionId.toString()}&TerminalId=${TerminalId}`;
  console.log('🚀 ~ file: createLocalCardTransaction.js:55 ~ strHashData', strHashData);
  const hashed = HmacSHA256(strHashData, merchantKey).toString().toUpperCase();
  console.log(
    '🚀 ~ file: createLocalCardTransaction.js:58 ~ }&DateTimeLocalTrxn=${now.getTime ~ hashed',
    hashed
  );
  const configurationObject = {
    MID: MerchantId,
    TID: TerminalId,
    AmountTrxn: amount * 1000,
    MerchantReference: transactionId.toString(),
    TrxDateTime: `${now.getTime()}`,
    SecureHash: hashed,
  };
  console.log(
    '🚀 ~ file: createLocalCardTransaction.js:69 ~ configurationObject',
    configurationObject
  );
  return configurationObject;
}
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createLocalCardTransaction });
};
