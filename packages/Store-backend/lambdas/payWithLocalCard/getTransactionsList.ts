interface GetTransactionsListProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
const getTransactionsList = async ({ arg, client }) => {
  const { userId: customerId, lastDoc: lastDoc } = arg[0];
  if (lastDoc) {
    const transactions = await client
      .db('generalData')
      .collection('transactions')
      .find({
        _id: { $gt: new ObjectId(lastDoc) },
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
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getTransactionsList });
};
