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
import { getAdminLocalCardCreds } from '../common/getAdminLocalCardCreds';
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
const createlocalCardTransaction = async ({ arg, client, userId }: createLocalCardTransaction) => {
  const { type, storeId, orderId, numberOfMonths, country } = arg[0];
  const customerDoc = await client
    .db('generalData')
    .collection('customerInfo')
    .findOne({ customerId: userId }, {});

  if (!customerDoc) throw new Error('customer not found');

  const customerId = customerDoc._id.toString();
  if (customerDoc.transactionId) {
    throw new Error('transaction in progress');
  }
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) }, {});
  if (!orderDoc) {
    throw new Error('order not found');
  }

  if (type === serviceFeePayment) {
    if (orderDoc.orders.find((storeOrder) => storeOrder.orderStatus !== STORE_STATUS_ACCEPTED)) {
      throw new Error('order not accepted yet');
    }

    if (customerDoc._id.toString() !== orderDoc.userId) {
      throw new Error('user id does not match');
    }
    if (orderDoc?.serviceFeePaid) {
      throw new Error('service fee already paid');
    }
    const amount = orderDoc.serviceFee;

    const transactionId = new ObjectId();
    const now = new Date();
    console.log(transactionId);

    const insertTransaction = await client.db('generalData').collection('transactions').insertOne(
      {
        _id: transactionId,
        customerId,
        amount: amount,
        storeId: adminName,
        orderId,
        transactionDate: now,
        validated: false,
        type,
      },
      {}
    );
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
    const { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();
    console.log('hdcbdh');
    const configurationObject = createLocalCardConfigurationObject({
      includeLocalCardTransactionFeeToPrice: true,
      secretKey,
      now,
      MerchantId,
      TerminalId,
      amount: amount,
      transactionId,
    });
    return { configurationObject };
  }

  if (type === storePayment) {
    const session = client.startSession();
    const result = await withTransaction({
      session,
      fn: async () => {
        const storeDoc = await client
          .db('generalData')
          .collection('storeInfo')
          .findOne({ _id: new ObjectId(storeId) }, { session });

        if (!storeDoc) {
          throw new Error('store document not found');
        }
        if (!storeDoc.localCardAPIKeyFilled) {
          throw new Error('store does not support local card');
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
          //   updateOne({ updateOneResult: updateOrder });
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
        const kmsClient = new KMS();

        const secretKey = await decryptData({ data: encryptedSecretKey, kmsKeyARN, kmsClient });

        const transactionId = new ObjectId();

        const insertTransaction = await client
          .db('generalData')
          .collection('transactions')
          .insertOne(
            {
              _id: transactionId,
              customerId,
              orderId,
              storeId,
              amount: amountToPay,
              paymentMethod: paymentMethods.localCard,
              // amount to return to customer if there were products that were not found in the store. the amount is the service fee for the products
              // amountToReturnToCustomer,
              transactionDate: now,
              validated: false,
            },
            { session }
          );
        // insertOne({ insertOneResult: insertTransaction });
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
        // updateOne({ updateOneResult: updateOrder });
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
  }
  if (type === subscriptionPayment) {
    const amount = numberOfMonths * hyfnPlusSubscriptionPrice;
    const now = new Date();
    const transactionId = new ObjectId();
    await client.db('generalData').collection('transactions').insertOne({
      customerId: customerDoc._id.toString(),
      amount,
      _id: transactionId,
      storeId: adminName,
      transactionDate: now,
      validated: false,
      type: 'subscription',
      numberOfMonths,
    });
    await client
      .db('generalData')
      .collection('customerInfo')
      .updateOne(
        { _id: new ObjectId(customerDoc._id.toString()) },
        {
          $set: {
            transactionId,
          },
        }
      );
    const { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();
    const configurationObject = await createLocalCardConfigurationObject({
      amount,
      includeLocalCardTransactionFeeToPrice: true,
      now,
      transactionId: transactionId,
      MerchantId,
      secretKey,
      TerminalId,
    });
    return { configurationObject };
  }

  if (type === managementPayment) {
    const session = client.startSession();

    const result = await withTransaction({
      session,
      fn: async () => {
        const userDoc = await client
          .db('generalData')
          .collection('customerInfo')
          .findOne({ customerId: userId }, { session });
        if (userDoc.transactionId) {
          throw new Error('there is a transaction in progress');
        }
        const orderDoc = await client
          .db('base')
          .collection('orders')
          .findOne({ _id: new ObjectId(orderId) }, { session });
        if (orderDoc.delivered) {
          throw new Error('Order delivered');
        }
        if (orderDoc.deliveryFeePaid) {
          throw new Error('delivery fee already paid');
        }
        if (orderDoc.orderType === ORDER_TYPE_PICKUP) {
          throw new Error('order type is pick up');
        }
        const managementDoc = await client
          .db('generalData')
          .collection('driverManagement')
          .findOne({ _id: new ObjectId(orderDoc.driverManagement) }, { session });
        const transactionId = new ObjectId();
        const {
          TerminalId,
          MerchantId,
          secretKey: encryptedSecretKey,
        } = managementDoc.localCardKeys;
        await client
          .db('generalData')
          .collection('customerInfo')
          .updateOne(
            { customerId: userId },
            {
              $set: {
                transactionId: transactionId,
              },
            }
          );
        await client.db('generalData').collection('transactions').insertOne(
          {
            _id: transactionId,
            storeId: orderDoc.driverManagement,
            customerId: userDoc._id.toString(),
            amount: orderDoc.deliveryFee,
            validated: false,
            type: TRANSACTION_TYPE_DRIVER_MANAGMENT,
            country: country,
            orderId: orderId,
          },
          { session }
        );
        const kmsKeyARN = process.env.kmsKeyARN || '';
        const secretKey = await decryptData({
          data: encryptedSecretKey,
          kmsKeyARN,
          kmsClient: new KMS(),
        });
        const transactionObject = createLocalCardConfigurationObject({
          amount: orderDoc.deliveryFee,
          includeLocalCardTransactionFeeToPrice: true,
          MerchantId,
          now: new Date(),
          secretKey,
          TerminalId,
          transactionId,
        });
        return { configurationObject: transactionObject };
      },
    });

    await session.endSession();
    return result;
  }
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createlocalCardTransaction });
};
