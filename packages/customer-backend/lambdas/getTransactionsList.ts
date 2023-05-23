interface GetTransactionsListProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const getTransactionsList = async ({ arg, client }) => {
  const { customerId, lastDocId: lastDoc } = arg[0];
  if (lastDoc) {
    const transactions = await client
      .db('generalData')
      .collection('transactions')
      .find({
        id: { $gt: new ObjectId(lastDoc) },
        customerId,
      })
      .limit(20)
      .toArray();
    return transactions;
  }
  const transactions = await client
    .db('generalData')
    .collection('transactions')
    .find({
      customerId,
    })
    .limit(20)
    .toArray();
  return transactions;
};
