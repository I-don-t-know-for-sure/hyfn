interface CancelTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const cancelTransaction = async ({ arg, client, db }: CancelTransactionProps) => {
  const result = await db.transaction().execute(async (trx) => {
    const { transactionId } = arg[0];

    const transactionDoc = await trx
      .selectFrom('transactions')
      .selectAll()
      .where('id', '=', transactionId)
      .executeTakeFirstOrThrow();
    if (transactionDoc.status.includes('validated')) {
      throw new Error('transaction validated');
    }

    await trx
      .updateTable('transactions')
      .set({
        status: ['canceled'],
      })
      .where('id', '=', transactionId)
      .executeTakeFirst();

    await trx
      .updateTable('customers')
      .set({
        transactionId: null,
      })
      .where('id', '=', transactionDoc.customerId)
      .executeTakeFirst();
  });
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: cancelTransaction });
};
