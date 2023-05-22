interface CreateLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import {
  ORDER_TYPE_PICKUP,
  STORE_STATUS_ACCEPTED,
  STORE_STATUS_PAID,
  STORE_STATUS_PENDING,
  TRANSACTION_TYPE_DRIVER_MANAGMENT,
  adminName,
  hyfnPlusSubscriptionPrice,
  managementPayment,
  paymentMethods,
  serviceFeePayment,
  storePayment,
  subscriptionPayment,
} from 'hyfn-types';
import { v4 as uuidV4 } from 'uuid';
import { getAdminLocalCardCreds } from './common/getAdminLocalCardCreds';
import { MainFunctionProps, decryptData, withTransaction } from 'hyfn-server';
import { mainWrapper } from 'hyfn-server';
import { createLocalCardConfigurationObject } from 'hyfn-server/src';
import { add } from 'mathjs';
import { calculateAmountToPayTheStoreAndAmountToReturnTheCustomer } from 'lambdas/common/calculateAmountToPayTheStoreAndAmountToReturnTheCustomer';
import { KMS } from 'aws-sdk';
/**
 *  have no idea what this do
 * @param {*} str1
 * @returns
 *
 */
/**
 * inserts new transaction document to transactions collection and returns the lightbox configuration object
 */
interface createLocalCardTransaction extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
const createlocalCardTransaction = async ({
  arg,
  client,
  userId,
  db,
}: createLocalCardTransaction) => {
  const { type, storeId, orderId, numberOfMonths, country } = arg[0];
  const customerDoc = await db
    .selectFrom('customers')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();

  const customerId = customerDoc.id;
  if (customerDoc.transactionId) {
    throw new Error('transaction in progress');
  }

  const result = await db.transaction().execute(async (trx) => {
    if (type === serviceFeePayment) {
      const orderDoc = await trx
        .selectFrom('orders')
        .selectAll('orders')
        .where('id', '=', orderId)
        .executeTakeFirstOrThrow();
      if (!orderDoc) {
        throw new Error('order not found');
      }
      if (orderDoc.storeStatus[orderDoc.storeStatus.length - 1] !== 'accepted') {
        throw new Error('order not accepted yet');
      }

      if (customerDoc.id !== orderDoc.customerId) {
        throw new Error('user id does not match');
      }
      // if (orderDoc?.serviceFeePaid) {
      //   throw new Error('service fee already paid');
      // }
      const amount = orderDoc.serviceFee;

      const now = new Date();

      const newTransaction = await trx
        .insertInto('transactions')
        .values({
          customerId,
          amount,
          storeId: adminName,
          orderId,
          transactionMethod: 'localCard',

          transactionDate: now,
          status: ['initial'],
          type,
        })
        .returning('id')
        .executeTakeFirst();

      await trx
        .updateTable('customers')
        .set({
          transactionId: newTransaction.id,
        })
        .where('userId', '=', userId)
        .executeTakeFirst();
      const { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();

      const configurationObject = createLocalCardConfigurationObject({
        includeLocalCardTransactionFeeToPrice: true,
        secretKey,
        now,

        MerchantId,
        TerminalId,
        amount: amount,
        transactionId: newTransaction.id,
      });
      return { configurationObject };
    }

    if (type === storePayment) {
      const storeDoc = await trx
        .selectFrom('stores')
        .innerJoin('localCardKeys', 'stores.localCardApiKeyId', 'localCardKeys.id')
        .selectAll('stores')
        .select(['merchantId', 'terminalId', 'secretKey'])
        .where('stores.id', '=', storeId)
        .executeTakeFirstOrThrow();

      if (!storeDoc) {
        throw new Error('store document not found');
      }
      if (!storeDoc.localCardApiKeyId) {
        throw new Error('store does not support local card');
      }
      const orderDoc = await trx
        .selectFrom('orders')
        .selectAll()
        .where('id', '=', orderId)
        .executeTakeFirstOrThrow();
      if (orderDoc.storeId !== storeDoc.id) throw new Error('store id does not match with order');
      // const storeOrder = orderDoc.orders.find((store) => store._id.toString() === storeId);
      if (orderDoc?.orderStatus[orderDoc?.orderStatus?.length - 1] === 'Canceled') {
        throw new Error('store order was canceled');
      }
      if (orderDoc.storeStatus.includes('paid')) {
        throw new Error('store is paid');
      }

      const now = new Date();

      if (!orderDoc.storeStatus.includes('accepted')) {
        throw new Error('Store did not accept order yet');
      }
      const paymentWindowCloseAt = new Date(orderDoc?.paymentWindowCloseAt);
      paymentWindowCloseAt.setHours(paymentWindowCloseAt.getHours() + 2);

      if (paymentWindowCloseAt <= now) {
        await db
          .updateTable('orders')
          .set({
            storeStatus: [...orderDoc?.storeStatus?.filter((status) => status !== 'accepted')],
          })
          .where('id', '=', orderDoc.id)
          .executeTakeFirst();

        throw new Error('Payment window closed');
      }

      if (!orderDoc.serviceFeePaid) {
        throw new Error('Service fee not paid');
      }

      const orderProducts = await trx
        .selectFrom('orderProducts')
        .where('orderId', '=', orderDoc.id)
        .selectAll()
        .execute();
      const { amountToPay: amountToPayForProducts } =
        calculateAmountToPayTheStoreAndAmountToReturnTheCustomer({
          storeOrder: { addedProducts: orderProducts },
        });
      const amountToPay = add(amountToPayForProducts, 0);

      const { terminalId, merchantId, secretKey: encryptedSecretKey } = storeDoc;

      const kmsKeyARN = process.env.kmsKeyARN || '';
      const kmsClient = new KMS();

      const secretKey = await decryptData({ data: encryptedSecretKey, kmsKeyARN, kmsClient });

      const newTransaction = await trx
        .insertInto('transactions')
        .values({
          customerId,
          orderId,
          storeId,
          // paymentMethod
          transactionMethod: 'localCard',

          amount: amountToPay,
          transactionDate: now,
          status: ['initial'],
          type,
        })
        .returning('id')
        .executeTakeFirst();

      await trx
        .updateTable('customers')
        .set({
          transactionId: newTransaction.id,
        })
        .where('userId', '=', userId)
        .executeTakeFirst();
      // TODO add the transaction info to the store object in the order document

      const configurationObject = createLocalCardConfigurationObject({
        includeLocalCardTransactionFeeToPrice: storeDoc.includeLocalCardFeeToPrice,
        amount: amountToPay as number,
        MerchantId: merchantId,
        now,
        secretKey,
        TerminalId: terminalId,
        transactionId: newTransaction.id,
      });
      return { configurationObject };
    }
    if (type === subscriptionPayment) {
      const amount = numberOfMonths * hyfnPlusSubscriptionPrice;
      const now = new Date();

      const newTransaction = await db
        .insertInto('transactions')
        .values({
          customerId,
          amount,
          status: ['initial'],
          transactionDate: now,
          transactionMethod: 'localCard',
          type,
          numberOfMonths,
        })
        .returning('id')
        .executeTakeFirst();

      await db
        .updateTable('customers')
        .set({
          transactionId: newTransaction.id,
        })
        .where('userId', '=', userId)
        .executeTakeFirst();
      const { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();
      const configurationObject = await createLocalCardConfigurationObject({
        amount,
        includeLocalCardTransactionFeeToPrice: true,
        now,
        transactionId: newTransaction.id,
        MerchantId,
        secretKey,
        TerminalId,
      });
      return { configurationObject };
    }

    if (type === managementPayment) {
      const userDoc = await trx
        .selectFrom('customers')
        .selectAll()
        .where('userId', '=', userId)
        .executeTakeFirst();
      if (userDoc.transactionId) {
        throw new Error('there is a transaction in progress');
      }

      const orderDoc = await trx
        .selectFrom('orders')
        .selectAll()
        .where('id', '=', orderId)
        .executeTakeFirstOrThrow();

      if (orderDoc?.orderStatus?.includes('delivered')) {
        throw new Error('Order delivered');
      }
      // if (orderDoc.deliveryFeePaid) {
      //   throw new Error('delivery fee already paid');
      // }
      if (orderDoc.orderType === ORDER_TYPE_PICKUP) {
        throw new Error('order type is pick up');
      }

      const managementDoc = await trx
        .selectFrom('driverManagements')
        .selectAll()
        .where('id', '=', orderDoc.driverManagement)
        .executeTakeFirstOrThrow();
      if (!managementDoc.localCardKeyFilled) throw new Error('no payment method');
      const { terminalId, merchantId, secureKey: encryptedSecretKey } = managementDoc;

      const newTransaction = await trx
        .insertInto('transactions')
        .values({
          storeId: orderDoc.driverManagement,
          customerId: orderDoc.customerId,
          amount: orderDoc.deliveryFee,
          status: ['initial'],
          orderId,
          type: 'managementPayment',
        })
        .returning('id')
        .executeTakeFirst();
      await trx
        .updateTable('customers')
        .set({
          transactionId: newTransaction.id,
        })
        .where('id', '=', orderDoc.customerId)
        .executeTakeFirst();
      const kmsKeyARN = process.env.kmsKeyARN || '';
      const secretKey = await decryptData({
        data: encryptedSecretKey,
        kmsKeyARN,
        kmsClient: new KMS(),
      });
      const transactionObject = createLocalCardConfigurationObject({
        amount: orderDoc.deliveryFee,
        includeLocalCardTransactionFeeToPrice: true,
        MerchantId: merchantId,
        now: new Date(),
        secretKey,
        TerminalId: terminalId,
        transactionId: newTransaction.id,
      });
      return { configurationObject: transactionObject };
    }
  });
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createlocalCardTransaction });
};
