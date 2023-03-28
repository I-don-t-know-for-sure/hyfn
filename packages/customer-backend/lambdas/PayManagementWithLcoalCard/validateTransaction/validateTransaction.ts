import { KMS } from 'aws-sdk';
import {
  MainFunctionProps,
  decryptData,
  isLocalCardTransactionValidated,
  mainWrapper,
  mainWrapperWithSession,
} from 'hyfn-server';
import { TRANSACTION_TYPE_DRIVER_MANAGMENT, collection } from 'hyfn-types';
import { ObjectId } from 'mongodb';

interface ValidateManagmentLocalCardTransactionPropos extends MainFunctionProps {
  arg: any[];
}

export const validateManagmentLocalCardTransaction = async ({
  arg,
  client,

  session,
}: ValidateManagmentLocalCardTransactionPropos) => {
  const { transactionId } = arg[0];
  const transactionDoc = await client
    .db('generalData')
    .collection('transactions')
    .findOne({ _id: new ObjectId(transactionId) }, { session });
  if (transactionDoc.validated) {
    throw new Error('already validated');
  }
  if (transactionDoc.type !== TRANSACTION_TYPE_DRIVER_MANAGMENT) {
    throw new Error('not driver management transaction');
  }
  const driverManagement = await client
    .db('generalData')
    .collection('driverManagement')
    .findOne({ _id: new ObjectId(transactionDoc.storeId) }, { session });
  const { TerminalId, MerchantId, secretKey: encryptedSecretKey } = driverManagement.localCardKeys;
  const kmsKeyARN = process.env.kmsKeyARN || '';
  const secretKey = await decryptData({
    data: encryptedSecretKey,
    kmsKeyARN,
    kmsClient: new KMS(),
  });
  const isValidated = await isLocalCardTransactionValidated({
    transactionId,
    amount: transactionDoc.amount,
    includeLocalCardTransactionFeeToPrice: true,
    TerminalId,
    MerchantId,
    secretKey,
  });

  if (!isValidated) {
    throw new Error('transaction not validated');
  }

  await client
    .db('generalData')
    .collection('driverManagement')
    .updateOne(
      { _id: new ObjectId(transactionDoc.storeId) },
      {
        $inc: {
          // balance: Math.abs(transactionDoc.amount),
          profits: Math.abs(transactionDoc.amount),
        },
      },
      { session }
    );

  await client
    .db('generalData')
    .collection('customerInfo')
    .updateOne(
      { _id: new ObjectId(transactionDoc.customerId) },
      {
        $set: {
          transactionId: undefined,
        },
      },
      { session }
    );
  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { _id: new ObjectId(transactionDoc.orderId) },
      {
        $set: {
          deliveryFeePaid: true,
        },
      },
      { session }
    );
  await client
    .db('generalData')
    .collection('transactions')
    .updateOne(
      { _id: new ObjectId(transactionId) },
      {
        $set: {
          validated: true,
        },
      }
    );
};

export const handler = async (event) => {
  return await mainWrapperWithSession({
    event,
    mainFunction: validateManagmentLocalCardTransaction,
  });
};
