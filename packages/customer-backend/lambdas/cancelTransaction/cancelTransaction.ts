import { MainFunctionProps, mainWrapper, mainWrapperWithSession } from 'hyfn-server';
import { ObjectId } from 'mongodb';

interface CancelTransactionPropos extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const cancelTransaction = async ({ arg, client, session }: CancelTransactionPropos) => {
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
};

export const handler = async (event) => {
  return await mainWrapperWithSession({ event, mainFunction: cancelTransaction });
};
