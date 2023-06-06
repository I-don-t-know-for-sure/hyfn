import { getAdminLocalCardCreds } from './common/getAdminLocalCardCreds';
import { decryptData, isLocalCardTransactionValidated, mainWrapper } from 'hyfn-server';
import { MainFunctionProps } from 'hyfn-server';
import {
  managementPayment,
  serviceFeePayment,
  storePayment,
  subscriptionPayment,
} from 'hyfn-types';
import { KMS } from 'aws-sdk';
import { returnsObj } from 'hyfn-types';
interface validateLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
const kmsKeyARN = process.env.kmsKeyARN || '';
export const validateLocalCardTransaction = async ({
  arg,
  userId,
  db,
}: validateLocalCardTransactionProps) => {
  const { transactionId } = arg[0];

  const transaction = await db
    .selectFrom('transactions')
    .selectAll()
    .where('id', '=', transactionId)
    .executeTakeFirstOrThrow();

  console.log('any');
  if (transaction.status.includes('validated')) {
    return 'transaction already approved';
  }

  if (transaction.type === subscriptionPayment || transaction.type === serviceFeePayment) {
    var { MerchantId, TerminalId, secretKey }: any = getAdminLocalCardCreds();
  }
  if (transaction.type === storePayment) {
    const storeDoc = await db
      .selectFrom('stores')
      .innerJoin('localCardKeys', 'localCardKeys.id', 'stores.localCardApiKeyId')
      .selectAll('stores')
      .select(['merchantId', 'terminalId', 'secretKey'])
      .where('stores.id', '=', transaction.storeId)
      .executeTakeFirstOrThrow();

    const kmsClient = new KMS();
    var {
      terminalId: TerminalId,
      merchantId: MerchantId,
      secretKey: encryptedSecretKey,
    }: any = storeDoc;
    var secretKey: any = await decryptData({
      data: encryptedSecretKey,
      kmsClient: kmsClient,
      kmsKeyARN: kmsKeyARN,
    });
  }
  if (transaction.type === managementPayment) {
    const driverManagement = await db
      .selectFrom('driverManagements')
      .innerJoin('localCardKeys', 'driverManagements.localCardApiKeyId', 'localCardKeys.id')
      .selectAll('driverManagements')
      .select(['localCardKeys.merchantId', 'localCardKeys.secretKey', 'localCardKeys.terminalId'])
      .where('driverManagements.id', '=', transaction.storeId)
      .executeTakeFirstOrThrow();

    var {
      terminalId: TerminalId,
      merchantId: MerchantId,
      secretKey: encryptedSecretKey,
    }: any = driverManagement;

    var secretKey: any = await decryptData({
      data: encryptedSecretKey,
      kmsKeyARN,
      kmsClient: new KMS(),
    });
  }

  const isValidated = await isLocalCardTransactionValidated({
    includeLocalCardTransactionFeeToPrice: true,
    MerchantId,
    secretKey,
    TerminalId,
    transactionId,
    amount: transaction.amount,
  });
  if (!isValidated) {
    throw new Error(returnsObj['transaction not validated']);
  }
  const result = await db.transaction().execute(async (db) => {
    const transaction = await db
      .selectFrom('transactions')
      .selectAll()
      .where('id', '=', transactionId)
      .executeTakeFirstOrThrow();

    if (transaction.status.includes('validated')) {
      return 'transaction already approved';
    }
    const type = transaction.type;

    if (type === subscriptionPayment) {
      const customerDoc = await db
        .selectFrom('customers')
        .selectAll()
        .where('userId', '=', userId)
        .executeTakeFirstOrThrow();
      // create a date and add the number of months from the transaction
      const date = new Date(customerDoc.expirationDate || new Date());
      date.setMonth(date.getMonth() + transaction.numberOfMonths);

      await db
        .updateTable('customers')
        .set({
          transactionId: null,
          subscribedToHyfnPlus: true,
          expirationDate: date,
        })
        .where('id', '=', transaction.customerId)
        .executeTakeFirst();

      await db
        .updateTable('transactions')
        .set({
          status: [...(transaction.status || []), 'validated'],
        })
        .where('id', '=', transaction.id)
        .executeTakeFirst();
      return 'transaction approved';
    }

    if (type === serviceFeePayment) {
      const orderDoc = await db
        .selectFrom('orders')
        .innerJoin('stores', 'orders.storeId', 'stores.id')
        .selectAll('orders')
        .select(['stores.storeType'])
        .where('orders.id', '=', transaction.orderId)
        .executeTakeFirst();
      await db
        .updateTable('orders')
        .set({
          serviceFeePaid: true,
          ...(orderDoc.orderType === 'Pickup' || orderDoc.driverManagement === orderDoc.storeId
            ? {
                storeStatus: [
                  ...(orderDoc.storeStatus || []),
                  orderDoc.storeType.includes('restaurant') ? 'preparing' : 'ready',
                ],
              }
            : {}),
        })
        .where('id', '=', transaction.orderId)
        .executeTakeFirst();
      await db
        .updateTable('transactions')
        .set({
          status: [...(transaction.status || []), 'validated'],
        })
        .where('id', '=', transaction.id)
        .executeTakeFirst();

      await db
        .updateTable('customers')
        .set({
          transactionId: null,
        })
        .where('id', '=', transaction.customerId)
        .executeTakeFirst();
      return 'transaction approved';
    }

    if (type === storePayment) {
      const orderDoc = await db
        .selectFrom('orders')
        .selectAll()
        .where('id', '=', transaction.orderId)
        .executeTakeFirst();

      await db
        .updateTable('orders')
        .set({
          storeStatus: [...(orderDoc.storeStatus || []), 'paid'],
        })
        .where('id', '=', transaction.orderId)
        .executeTakeFirst();
      await db
        .updateTable('transactions')
        .set({
          status: [...(transaction.status || []), 'validated'],
        })
        .where('id', '=', transaction.id)
        .executeTakeFirst();
      await db
        .updateTable('customers')
        .set({
          transactionId: null,
        })
        .where('id', '=', transaction.customerId)
        .executeTakeFirst();
      // await db.updateTable('stores').set({
      //   sales: sql`tStores.sales + transaction.amount`
      // })

      return 'transaction approved';
    }

    if (type === managementPayment) {
      // await client
      //   .db('generalData')
      //   .collection('driverManagement')
      //   .updateOne(
      //     {id: new ObjectId(transaction.storeId) },
      //     {
      //       $inc: {
      //         // balance: Math.abs(transaction.amount),
      //         profits: Math.abs(transaction.amount),
      //       },
      //     },
      //     { session }
      //   );

      await db
        .updateTable('customers')
        .set({
          transactionId: null,
        })
        .where('id', '=', transaction.customerId)
        .executeTakeFirst();

      await db
        .updateTable('orders')
        .set({
          deliveryFeePaid: true,
        })
        .where('id', '=', transaction.orderId)
        .executeTakeFirst();

      await db
        .updateTable('transactions')
        .set({
          status: [...(transaction.status || []), 'validated'],
        })
        .where('id', '=', transaction.id)
        .executeTakeFirst();
    }
  });
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: validateLocalCardTransaction,
    validateUser: false,
  });
};
