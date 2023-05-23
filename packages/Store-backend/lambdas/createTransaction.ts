interface CreateLocalCardTransactionForWalletProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { v4 as uuidV4 } from 'uuid';

import { adminName } from 'hyfn-types';
import { getAdminLocalCardCreds } from './common/getAdminLocalCardCreds';
import { createLocalCardConfigurationObject, MainFunctionProps, mainWrapper } from 'hyfn-server';
const createLocalCardTransactionForWallet = async ({
  arg,
  client,
  db,
  userId,
}: MainFunctionProps) => {
  const { amount } = arg[0];
  const storeDoc = await db
    .selectFrom('stores')
    .select('id')
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  if (amount === undefined) {
    throw 'order data not found';
  }
  const transactionId = uuidV4() as string;
  const now = new Date();

  await db
    .insertInto('transactions')
    .values({
      id: transactionId,
      customerId: storeDoc.id,
      amount,
      storeId: adminName,
      transactionDate: now,

      type: 'storeWallet',
      status: ['initial'],
    })
    .executeTakeFirst();
  const { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();

  const configurationObject = createLocalCardConfigurationObject({
    includeLocalCardTransactionFeeToPrice: true,
    secretKey,
    now,
    MerchantId,
    TerminalId,
    amount,
    transactionId,
  });
  return { configurationObject };
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createLocalCardTransactionForWallet });
};
