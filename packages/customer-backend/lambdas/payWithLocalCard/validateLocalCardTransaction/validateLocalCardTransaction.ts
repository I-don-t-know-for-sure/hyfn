import { ObjectId } from 'mongodb';
import { adminName } from '../../common/constants';
import { getAdminLocalCardCreds } from '../../common/getAdminLocalCardCreds';
import { isLocalCardTransactionValidated, mainWrapper, withTransaction } from 'hyfn-server';
import { MainFunctionProps } from 'hyfn-server';
interface validateLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const validateLocalCardTransaction = async ({
  arg,
  client,
}: validateLocalCardTransactionProps) => {
  const session = client.startSession();
  const result = await withTransaction({
    session,
    fn: async () => {
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
      // create a date and add the number of months from the transaction
      const date = new Date();
      date.setMonth(date.getMonth() + transaction.months);

      if (isValidated) {
        await client
          .db('generalData')
          .collection('customerInfo')
          .updateOne(
            { _id: new ObjectId(transaction.customerId) },
            {
              ...(transaction.type === 'subscription'
                ? {
                    $set: {
                      transactionId: undefined,
                      subscribedToHyfnPlus: true,
                      expirationDate: date,
                    },
                  }
                : {
                    $set: {
                      transactionId: undefined,
                    },
                    $inc: { balance: Math.abs(parseFloat(transaction.amount)) },
                  }),
            },
            {
              session,
            }
          );
        return 'transaction approved';
      }
      return 'transaction not approved yet or not found';
    },
  });

  await session.endSession();
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: validateLocalCardTransaction,
  });
};
