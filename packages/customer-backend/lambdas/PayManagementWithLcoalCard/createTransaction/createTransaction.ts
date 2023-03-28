import { KMS } from 'aws-sdk';
import {
  MainFunctionProps,
  createLocalCardConfigurationObject,
  decryptData,
  mainWrapper,
  mainWrapperWithSession,
} from 'hyfn-server';
import { ORDER_TYPE_PICKUP, TRANSACTION_TYPE_DRIVER_MANAGMENT } from 'hyfn-types';
import { ObjectId } from 'mongodb';

interface CreateManagementLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const createManagementLocalCardTransaction = async ({
  arg,
  client,
  userId,
  session,
}: CreateManagementLocalCardTransactionProps) => {
  const { orderId, country } = arg[0];
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
  const { TerminalId, MerchantId, secretKey: encryptedSecretKey } = managementDoc.localCardKeys;
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
};

export const handler = async (event) => {
  return await mainWrapperWithSession({
    event,
    mainFunction: createManagementLocalCardTransaction,
  });
};
