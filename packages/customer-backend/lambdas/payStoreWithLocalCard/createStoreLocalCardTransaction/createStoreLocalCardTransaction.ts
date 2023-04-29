interface CreateStoreLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import { calculateAmountToPayTheStoreAndAmountToReturnTheCustomer } from '../../common/calculateAmountToPayTheStoreAndAmountToReturnTheCustomer';
import {
  STORE_STATUS_ACCEPTED,
  STORE_STATUS_PENDING,
  STORE_TYPE_RESTAURANT,
  paymentMethods,
  storeSchema,
  STORE_STATUS_PAID,
} from 'hyfn-types';
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
import { decryptData, findOne, insertOne, updateOne } from 'hyfn-server';
import { createLocalCardConfigurationObject } from 'hyfn-server';
import { KMS } from 'aws-sdk';
import { z } from 'zod';
import { add } from 'mathjs';
/**
 *  have no idea what this do
 * @param {*} str1
 * @returns
 *
 */
/**
 * inserts new transaction document to transactions collection and returns the lightbox configuration object
 */
const kmsClient = new KMS();
interface createManagementLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
const createStoreLocalCardTransaction = async ({
  arg,
  client,
}: createManagementLocalCardTransactionProps) => {
  const session = client.startSession();
  const result = await withTransaction({
    session,
    fn: async () => {
      const { customerId, orderId, storeId, country } = arg[0];
      const customerDoc = await client
        .db('generalData')
        .collection('customerInfo')
        .findOne({ _id: new ObjectId(customerId) });
      if (customerDoc.transactionId) {
        throw new Error('you have a transaction in progress');
      }
      const storeDoc = await client
        .db('generalData')
        .collection('storeInfo')
        .findOne({ _id: new ObjectId(storeId) }, { session });
      findOne({ findOneResult: storeDoc });
      if (!storeDoc) {
        throw new Error('store document not found');
      }
      if (!storeDoc.localCardAPIKeyFilled) {
        throw new Error('store does not support local card');
      }
      const orderDoc = await client
        .db('base')
        .collection('orders')
        .findOne({ _id: new ObjectId(orderId) }, { session });
      findOne({ findOneResult: orderDoc });
      if (!orderDoc) {
        throw new Error('bd');
      }
      const storeOrder = orderDoc.orders.find((store) => store._id.toString() === storeId);
      if (storeOrder.canceled) {
        throw new Error('store order was canceled');
      }
      if (storeOrder.orderStatus === STORE_STATUS_PAID) {
        throw new Error('store is paid');
      }

      const now = new Date();
      const accepted = storeOrder.orderStatus === STORE_STATUS_ACCEPTED;
      if (!accepted) {
        throw new Error('Store did not accept order yet');
      }
      const paymentWindowCloseAt = new Date(storeOrder?.paymentWindowCloseAt);
      if (paymentWindowCloseAt <= now) {
        const updateOrder = await client
          .db('base')
          .collection('orders')
          .updateOne(
            { _id: new ObjectId(orderId) },
            {
              $set: {
                ['orders.$[store].orderStatus']: STORE_STATUS_PENDING,
                // ['status.$[store].status']: STORE_STATUS_PENDING,
              },
            },
            { arrayFilters: [{ 'store._id': new ObjectId(storeId) }] }
          );
        updateOne({ updateOneResult: updateOrder });
        throw new Error('Payment window closed');
      }
      // }
      if (!orderDoc.serviceFeePaid) {
        throw new Error('Service fee not paid');
      }
      const storePaid = storeOrder?.transactions?.some((transaction) => {
        return transaction.validated;
      });
      if (storePaid) {
        throw new Error('Store already paid');
      }
      const {
        amountToPay: amountToPayForProducts,
        amountToReturnToCustomer,
        originalCost,
      } = calculateAmountToPayTheStoreAndAmountToReturnTheCustomer({
        storeOrder,
      });
      const amountToPay = add(amountToPayForProducts, 0);

      const { TerminalId, MerchantId, secretKey: encryptedSecretKey } = storeDoc.localCardAPIKey;

      const kmsKeyARN = process.env.kmsKeyARN || '';
      const secretKey = await decryptData({ data: encryptedSecretKey, kmsKeyARN, kmsClient });

      const transactionId = new ObjectId();

      const insertTransaction = await client.db('generalData').collection('transactions').insertOne(
        {
          _id: transactionId,
          customerId,
          orderId,
          storeId,
          amount: amountToPay,
          paymentMethod: paymentMethods.localCard,
          // amount to return to customer if there were products that were not found in the store. the amount is the service fee for the products
          amountToReturnToCustomer,
          transactionDate: now,
          validated: false,
        },
        { session }
      );
      insertOne({ insertOneResult: insertTransaction });
      await client
        .db('generalData')
        .collection('customerInfo')
        .updateOne(
          { _id: new ObjectId(customerId) },
          {
            $set: {
              transactionId,
            },
          }
        );
      // TODO add the transaction info to the store object in the order document
      const updateOrder = await client
        .db('base')
        .collection('orders')
        .updateOne(
          {
            _id: new ObjectId(orderId),
          },
          {
            $push: {
              [`orders.$[store].transactions`]: {
                _id: transactionId,
                paymentMethod: paymentMethods.localCard,
                amount: amountToPay,
                // amount to return to customer if there were products that were not found in the store. the amount is the service fee for the products
                transactionDate: now,
                validated: false,
              },
            },
          },
          {
            arrayFilters: [{ 'store._id': new ObjectId(storeId) }],
            session,
          }
        );
      updateOne({ updateOneResult: updateOrder });
      const configurationObject = createLocalCardConfigurationObject({
        includeLocalCardTransactionFeeToPrice: storeDoc.includeLocalCardFeeToPrice,
        amount: amountToPay as number,
        MerchantId,
        now,
        secretKey,
        TerminalId,
        transactionId,
      });
      return { configurationObject };
    },
  });
  await session.endSession();
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createStoreLocalCardTransaction });
};
