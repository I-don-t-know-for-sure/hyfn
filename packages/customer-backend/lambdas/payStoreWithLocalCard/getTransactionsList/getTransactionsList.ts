interface GetTransactionsListProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { ObjectId } from 'mongodb';
import { MainFunctionProps } from 'hyfn-server/src';

export const getTransactionsList = async ({ arg, client }: MainFunctionProps) => {
  const { customerId, lastDocId } = arg[0];

  if (lastDocId) {
    const transactions = await client
      .db('generalData')
      .collection('transactions')
      .find({
        _id: { $gt: new ObjectId(lastDocId) },
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
