interface CreateLocalCardTransactionForWalletProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { v4 as uuidV4 } from 'uuid';

import { adminName } from 'hyfn-types';
import { getAdminLocalCardCreds } from './common/getAdminLocalCardCreds';
import { createLocalCardConfigurationObject, MainFunctionProps, mainWrapper } from 'hyfn-server';
const createLocalCardTransactionForWallet = async ({ arg, client, db }: MainFunctionProps) => {
  const { userId, amount } = arg[0];
  if (amount === undefined) {
    throw 'order data not found';
  }
  const transactionId = uuidV4() as string;
  const now = new Date();

  await db
    .insertInto('transactions')
    .values({
      id: transactionId,
      customerId: userId,
      amount,
      storeId: adminName,
      transactionDate: now,

      type: 'storeWallet',
      validated: false,
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
