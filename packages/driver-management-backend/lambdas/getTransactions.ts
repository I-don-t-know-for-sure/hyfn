import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

interface GetTransactionsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const getTransactions = async ({ arg, client, userId }: GetTransactionsProps) => {
  const { lastDoc } = arg[0];
  const userDoc = await client
    .db('generalData')
    .collection('driverManagement')
    .findOne({ usersIds: userId });

  return await client
    .db('generalData')
    .collection('transactions')
    .find({
      ...(lastDoc ? { _id: { $gt: new ObjectId(lastDoc) } } : {}),

      storeId: userDoc._id.toString(),
    })
    .limit(15)
    .toArray();
};

export const handler = async (event) => {
  return mainWrapper({ event, mainFunction: getTransactions });
};
