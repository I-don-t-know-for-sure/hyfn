interface CancelTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const cancelTransaction = async ({ arg, client }: CancelTransactionProps) => {
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const { transactionId } = arg[0];
      const transactionDoc = await client
        .db('generalData')
        .collection('transactions')
        .findOne({ _id: new ObjectId(transactionId) }, { session });
      if (transactionDoc.validated) {
        throw new Error('transaction validated');
      }
      await client
        .db('generalData')
        .collection('transactions')
        .updateOne(
          { _id: new ObjectId(transactionId) },
          {
            $set: {
              canceled: true,
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
    });
  } finally {
    await session.endSession();
  }
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: cancelTransaction });
};
