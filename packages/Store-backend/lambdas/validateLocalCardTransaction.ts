interface ValidateLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import { adminName, TRANSACTION_TYPE_WALLET } from 'hyfn-types';
import { getAdminLocalCardCreds } from './common/getAdminLocalCardCreds';
import {
  isLocalCardTransactionValidated,
  MainFunctionProps,
  mainWrapper,
  tStores,
} from 'hyfn-server';
import { returnsObj } from 'hyfn-types';
import { sql } from 'kysely';
const validateLocalCardTransaction = async ({ arg, client, db }: MainFunctionProps) => {
  const { transactionId } = arg[0];
  // const dataServicesURL = process.env.moalmlatDataService;

  const transaction = await db
    .selectFrom('transactions')
    .selectAll()
    .where('id', '=', transactionId)
    .executeTakeFirstOrThrow();
  // const storeDoc = await db
  // .selectFrom('stores')
  // .selectAll()
  // .where('userId', '=', userId)
  // .executeTakeFirstOrThrow();

  if (transaction.status[transaction.status.length - 1] === 'validated') {
    return returnsObj['transaction already approved'];
  }

  if (transaction.storeId === adminName) {
    var { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();
  }

  const isValidated = await isLocalCardTransactionValidated({
    MerchantId,
    secretKey,
    TerminalId,
    transactionId,
    includeLocalCardTransactionFeeToPrice: true,
    amount: transaction.amount,
  });

  if (!isValidated) {
    return returnsObj['transaction not approved yet or not found'];
  }
  const response = await db.transaction().execute(async (trx) => {
    const transaction = await trx
      .selectFrom('transactions')
      .selectAll()
      .where('id', '=', transactionId)
      .executeTakeFirstOrThrow();

    if (transaction.status[transaction.status.length - 1] === 'validated') {
      return returnsObj['transaction already approved'];
    }

    await trx
      .updateTable('transactions')
      .set({
        status: [...transaction.status, 'validated'],
      })
      .where('id', '=', transaction.id)
      .execute();

    if (transaction.type === 'storeWallet') {
      await trx
        .updateTable('stores')
        .set({
          balance: sql`${sql.raw(tStores.balance)}::numeric + ${transaction.amount}::numeric`,
        })
        .where('id', '=', transaction.customerId)
        .execute();
      return returnsObj['transaction approved'];
    }

    return returnsObj['transaction approved'];
  });

  return response;
};
export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: validateLocalCardTransaction,
    validateUser: false,
  });
};
