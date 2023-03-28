import { ObjectId } from 'mongodb';
import { adminName } from '../../common/constants';
import { getAdminLocalCardCreds } from '../../common/getAdminLocalCardCreds';
import { isLocalCardTransactionValidated, mainWrapperWithSession } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';

interface validateLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const validateLocalCardTransaction = async ({
  arg,
  client,
  session,
  event,
}: validateLocalCardTransactionProps) => {
  console.log(
    '🚀 ~ file: validateLocalCardTransaction.js:13 ~ validateLocalCardTransaction ~ arg',
    arg
  );

  const { transactionId } = arg[0];

  // const transaction = await findOne(
  //   { _id: new ObjectId(transactionId) },
  //   { session },
  //   client.db('generalData').collection('transactions')
  // );

  const transaction = await client
    .db('generalData')
    .collection('transactions')
    .findOne({ _id: new ObjectId(transactionId) }, { session });
  if (!transaction) {
    throw '';
  }
  console.log('any');
  if (transaction.validated) {
    return 'transaction already approved';
  }
  console.log('log here');
  if (transaction.storeId === adminName) {
    var { MerchantId, TerminalId, secretKey }: any = getAdminLocalCardCreds();
  }
  console.log({
    MerchantId,
    secretKey,
    TerminalId,
    transactionId,
    client,
    session,
  });

  const isValidated = await isLocalCardTransactionValidated({
    includeLocalCardTransactionFeeToPrice: false,
    MerchantId,
    secretKey,
    TerminalId,
    transactionId,

    amount: transaction.amount,
  });
  console.log('herehh');
  if (isValidated) {
    // TODO increase user balance
    // await updateOne({
    //   query: { _id: new ObjectId(transaction.customerId) },
    //   update: {
    //     $inc: { balance: Math.abs(parseFloat(transaction.amount)) },
    //   },
    //   options: {
    //     session,
    //   },
    //   collection: client.db('generalData').collection('customerInfo'),
    // });

    await client
      .db('generalData')
      .collection('customerInfo')
      .updateOne(
        { _id: new ObjectId(transaction.customerId) },
        {
          $set: {
            transactionId: undefined,
          },
          $inc: { balance: Math.abs(parseFloat(transaction.amount)) },
        },
        {
          session,
        }
      );
    return 'transaction approved';
  }

  return 'transaction not approved yet or not found';
};

export const handler = async (event) => {
  return await mainWrapperWithSession({
    event,
    mainFunction: validateLocalCardTransaction,
  });
};
