interface CreateLocalCardTransactionForWalletProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { v4 as uuidV4 } from 'uuid';

import { adminName, returnsObj } from 'hyfn-types';
import { getAdminLocalCardCreds } from './common/getAdminLocalCardCreds';
import { createLocalCardConfigurationObject, MainFunctionProps, mainWrapper } from 'hyfn-server';
export const createLocalCardTransactionForWallet = async ({
  arg,
  client,
  db,
  userId,
}: MainFunctionProps) => {
  const { amount } = arg[0];
  const storeDoc = await db
    .selectFrom('stores')
    .select(['id', 'transactionId'])
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  if (amount === undefined) {
    throw 'order data not found';
  }
  if(storeDoc.transactionId) throw new Error(returnsObj['transaction in progress'])

  const now = new Date();

 const transaction =  await db
    .insertInto('transactions')
    .values({

      customerId: storeDoc.id,
      amount,
      storeId: adminName,
      transactionDate: now,
      transactionMethod: 'local card',
      type: 'store wallet',
      status: ['initial'],
    }).returning('id')
    .executeTakeFirst();
  const { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();

  const configurationObject = createLocalCardConfigurationObject({
    includeLocalCardTransactionFeeToPrice: true,
    secretKey,
    now,
    MerchantId,
    TerminalId,
    amount,
    transactionId: transaction.id,
  });

  await db.updateTable('stores').set({
    transactionId: transaction.id
  }).where('userId', '=', userId).execute()
  return { configurationObject };
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createLocalCardTransactionForWallet });
};
