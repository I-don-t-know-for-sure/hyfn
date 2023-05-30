import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { sql } from 'kysely';
import { ObjectId } from 'mongodb';

interface GetTransactionsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const getTransactions = async ({ arg, client, userId, db }: GetTransactionsProps) => {
  const { lastDoc } = arg[0];
  const userDoc = await db
    .selectFrom('driverManagements')
    .selectAll()
    .where('usersIds', '@>', sql`array[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();

  return await db
    .selectFrom('transactions')
    .selectAll()
    .where('storeId', '=', userDoc.id)
    .execute();
};

export const handler = async (event) => {
  return mainWrapper({ event, mainFunction: getTransactions });
};
