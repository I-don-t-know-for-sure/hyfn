import { ObjectId } from 'mongodb';
import { adminName } from '../common/constants';
import { getAdminLocalCardCreds } from '../common/getAdminLocalCardCreds';
import {
  decryptData,
  isLocalCardTransactionValidated,
  mainWrapper,
  withTransaction,
} from 'hyfn-server';
import { MainFunctionProps } from 'hyfn-server';
import {
  ORDER_TYPE_PICKUP,
  STORE_STATUS_PAID,
  managementPayment,
  serviceFeePayment,
  storePayment,
  subscriptionPayment,
} from 'hyfn-types';
import { KMS } from 'aws-sdk';
interface validateLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
const kmsKeyARN = process.env.kmsKeyARN || '';
export const validateLocalCardTransaction = async ({
  arg,
  client,
}: validateLocalCardTransactionProps) => {
  const { transactionId } = arg[0];
  const transaction = await client
    .db('generalData')
    .collection('transactions')
    .findOne({ _id: new ObjectId(transactionId) }, {});
  if (!transaction) {
    throw '';
  }
  console.log('any');
  if (transaction.validated) {
    return 'transaction already approved';
  }

  if (transaction.type === subscriptionPayment || transaction.type === serviceFeePayment) {
    var { MerchantId, TerminalId, secretKey }: any = getAdminLocalCardCreds();
  }
  if (transaction.type === storePayment) {
    const storeDoc = await client
      .db('generalData')
      .collection('storeInfo')
      .findOne({ _id: new ObjectId(transaction.storeId) }, {});
    //   findOne({ findOneResult: storeDoc });
    if (!storeDoc) {
      throw new Error('store not found');
    }
    const kmsClient = new KMS();
    var { TerminalId, MerchantId, secretKey: encryptedSecretKey } = storeDoc.localCardAPIKey;
    var secretKey: any = await decryptData({
      data: encryptedSecretKey,
      kmsClient: kmsClient,
      kmsKeyARN: kmsKeyARN,
    });
  }
  if (transaction.type === managementPayment) {
    const driverManagement = await client
      .db('generalData')
      .collection('driverManagement')
      .findOne({ _id: new ObjectId(transaction.storeId) }, {});
    var { TerminalId, MerchantId, secretKey: encryptedSecretKey } = driverManagement.localCardKeys;

    var secretKey: any = await decryptData({
      data: encryptedSecretKey,
      kmsKeyARN,
      kmsClient: new KMS(),
    });
  }

  const isValidated = await isLocalCardTransactionValidated({
    includeLocalCardTransactionFeeToPrice: false,
    MerchantId,
    secretKey,
    TerminalId,
    transactionId,
    amount: transaction.amount,
  });
  if (!isValidated) {
    throw new Error('transaction not validated');
  }
  const session = client.startSession();
  const result = await withTransaction({
    session,
    fn: async () => {
      const transaction = await client
        .db('generalData')
        .collection('transactions')
        .findOne({ _id: new ObjectId(transactionId) }, { session });
      if (!transaction) {
        throw new Error('transaction not found');
      }

      if (transaction.validated) {
        return 'transaction already approved';
      }
      const type = transaction.type;

      if (type === subscriptionPayment || type === serviceFeePayment) {
        // create a date and add the number of months from the transaction
        const date = new Date();
        date.setMonth(date.getMonth() + transaction.months);

        await client
          .db('generalData')
          .collection('customerInfo')
          .updateOne(
            { _id: new ObjectId(transaction.customerId) },
            {
              ...(transaction.type === 'subscription'
                ? {
                    $set: {
                      transactionId: undefined,
                      subscribedToHyfnPlus: true,
                      expirationDate: date,
                    },
                  }
                : {
                    $set: {
                      transactionId: undefined,
                    },
                    $inc: { balance: Math.abs(parseFloat(transaction.amount)) },
                  }),
            },
            {
              session,
            }
          );
        return 'transaction approved';
      }

      if (type === storePayment) {
        // const customerDocUpdate = await client
        //   .db('generalData')
        //   .collection('customerInfo')
        //   .updateOne(
        //     { _id: new ObjectId(transaction.customerId) },
        //     {
        //       $set: {
        //         balance: -Math.abs(transaction.amount),
        //       },
        //     }
        //   );
        // updateOne({ updateOneResult: customerDocUpdate });
        const orderDoc = await client
          .db('base')
          .collection('orders')
          .findOne({ _id: new ObjectId(transaction.orderId) }, {});
        if (!orderDoc) {
          throw new Error('order not found');
        }
        // findOne({ findOneResult: orderDoc });
        var updateDoc = {
          [`orders.$[store].transactions.$[transaction].validated`]: true,
          [`orders.$[store].paid`]: true,
          [`orders.$[store].orderStatus`]: STORE_STATUS_PAID,
          // ['status.$[customer].status']: ORDER_STATUS_DELIVERED,
          [`orders.$[store].paymentDate`]: new Date(),
          // ['status.$[store].status']: ORDER_STATUS_DELIVERED,
        } as any;
        if (!orderDoc) {
          throw '';
        }
        if (orderDoc.orderType === ORDER_TYPE_PICKUP) {
          const storesNotPaid = orderDoc.orders.some((store) => {
            return !store.paid;
          });
          if (!storesNotPaid) {
            updateDoc = { ...updateDoc, delivered: true };
          }
        }
        const updateOrderDoc = await client
          .db('base')
          .collection('orders')
          .updateOne(
            { _id: new ObjectId(transaction.orderId) },
            {
              $set: updateDoc,
            },
            {
              session,
              arrayFilters: [
                {
                  'store._id': new ObjectId(transaction.storeId),
                },
                { 'transaction._id': new ObjectId(transaction._id.toString()) },
              ],
            }
          );
        // updateOne({ updateOneResult: updateOrderDoc });
        await client
          .db('generalData')
          .collection('transactions')
          .updateOne(
            { _id: new ObjectId(transactionId) },
            {
              $set: { validated: true },
            },
            { session }
          );
        // if (transaction.amountToReturnToCustomer && transaction.amountToReturnToCustomer > 0.0) {
        const customerInfoUpdate = await client
          .db('generalData')
          .collection('customerInfo')
          .updateOne(
            {
              _id: new ObjectId(transaction.customerId),
            },
            {
              $set: {
                transactionId: undefined,
              },
              ...(transaction.amountToReturnToCustomer && transaction.amountToReturnToCustomer > 0.0
                ? {
                    $inc: {
                      balance: Math.abs(transaction.amountToReturnToCustomer),
                    },
                  }
                : {}),
            },
            { session }
          );
        // updateOne({ updateOneResult: customerInfoUpdate });
        // }
        const storeInfoUpdate = await client
          .db('generalData')
          .collection('storeInfo')
          .updateOne(
            { _id: new ObjectId(transaction.storeId) },
            {
              $inc: {
                sales: Math.abs(transaction.amount),
              },
            },
            { session }
          );
        // updateOne({ updateOneResult: storeInfoUpdate });
        return 'transaction approved';
      }

      if (type === managementPayment) {
        await client
          .db('generalData')
          .collection('driverManagement')
          .updateOne(
            { _id: new ObjectId(transaction.storeId) },
            {
              $inc: {
                // balance: Math.abs(transaction.amount),
                profits: Math.abs(transaction.amount),
              },
            },
            { session }
          );
        await client
          .db('generalData')
          .collection('customerInfo')
          .updateOne(
            { _id: new ObjectId(transaction.customerId) },
            {
              $set: {
                transactionId: undefined,
              },
            },
            { session }
          );
        await client
          .db('base')
          .collection('orders')
          .updateOne(
            { _id: new ObjectId(transaction.orderId) },
            {
              $set: {
                deliveryFeePaid: true,
              },
            },
            { session }
          );
        await client
          .db('generalData')
          .collection('transactions')
          .updateOne(
            { _id: new ObjectId(transactionId) },
            {
              $set: {
                validated: true,
              },
            }
          );
      }
    },
  });

  await session.endSession();
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: validateLocalCardTransaction,
  });
};
