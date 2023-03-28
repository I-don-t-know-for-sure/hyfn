import {
  isLocalCardTransactionValidated,
  MainFunctionProps,
  mainWrapperWithSession,
} from 'hyfn-server';
import { adminName } from 'hyfn-types';
import { ObjectId } from 'mongodb';

const { getAdminLocalCardCreds } = require('../common/getAdminLocalCardCreds');

const validateLocalCardTransaction = async ({ arg, client, session }: MainFunctionProps) => {
  const { transactionId } = arg[0];
  console.log(
    '🚀 ~ file: validateLocalCardTransaction.js ~ line 12 ~ validateLocalCardTransaction ~ transactionId',
    transactionId
  );
  // const dataServicesURL = process.env.moalmlatDataService;

  const transaction = await client
    .db('generalData')
    .collection('transactions')
    .findOne(
      { _id: new ObjectId(transactionId) },
      // { session },
      {}
    );
  console.log('any');
  if (transaction.validated) {
    return 'transaction already approved';
  }
  console.log('log here');
  if (transaction.storeId === adminName) {
    var { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();
  }
  console.log('shsh');
  const isValidated = await isLocalCardTransactionValidated({
    MerchantId,
    secretKey,
    TerminalId,
    transactionId,

    includeLocalCardTransactionFeeToPrice: true,
    amount: transaction.amount,
  });

  console.log('herehh');
  if (isValidated) {
    await client.db('generalData').collection('transactions').updateOne(
      { _id: transaction._id },
      {
        validated: true,
      }
    );
    await client
      .db('generalData')
      .collection('driverManagement')
      .updateOne(
        {
          _id: new ObjectId(transaction.customerId),
        },
        {
          $inc: {
            balance: Math.abs(parseFloat(transaction.amount.toFixed(3))),
          },
        },
        { session }
      );
    return 'transaction approved';
  }

  return 'transaction not approved yet or not found';
};

export const handler = async (event) => {
  return await mainWrapperWithSession({ event, mainFunction: validateLocalCardTransaction });
};
