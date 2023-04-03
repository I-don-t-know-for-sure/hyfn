interface CreateLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { hex_to_ascii, MainFunctionProps, mainWrapper } from 'hyfn-server';
import { adminName } from 'hyfn-types';
import { ObjectId } from 'mongodb';
const { HmacSHA256 } = require('crypto-js');
const { getAdminLocalCardCreds } = require('../common/getAdminLocalCardCreds');
const createLocalCardTransaction = async ({ arg, client, userId }: MainFunctionProps) => {
  throw new Error('No payments');
  const userDocument = await client
    .db('generalData')
    .collection('driverManagement')
    .findOne({ userId });
  const { _id } = userDocument;
  const { amount } = arg[0];
  if (amount === undefined) {
    throw 'order data not found';
  }
  if (userDocument.verified) {
    throw new Error('Management is verified');
  }

  const transactionId = new ObjectId();
  const now = new Date();
  await client.db('generalData').collection('transactions').insertOne(
    {
      _id: transactionId,
      customerId: _id.toString(),
      amount,
      storeId: adminName,
      transactionDate: now,
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
