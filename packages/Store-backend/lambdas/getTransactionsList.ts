interface GetTransactionsListProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

const getTransactionsList = async ({ arg, client, db }: MainFunctionProps) => {
  const { userId: customerId, lastDoc: lastDoc } = arg[0];

  const transactions = await db
    .selectFrom('transactions')
    .selectAll()
    .where('customerId', '=', customerId)
    .execute();
  return transactions;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getTransactionsList });
};
