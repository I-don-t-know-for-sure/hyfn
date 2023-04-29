interface CreateServiceFeeCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import { adminName, STORE_STATUS_ACCEPTED, transactionSchema } from 'hyfn-types';
import { getAdminLocalCardCreds } from '../../common/getAdminLocalCardCreds';
import { MainFunctionProps } from 'hyfn-server/src';
import { insertOne, mainWrapper } from 'hyfn-server/src';
import { createLocalCardConfigurationObject } from 'hyfn-server/src';
import { z } from 'zod';
/**
 *  have no idea what this do
 * @param {*} str1
 * @returns
 *
 */
/**
 * inserts new transaction document to transactions collection and returns the lightbox configuration object

*/
interface createServiceFeeCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const createlocalCardTransaction = async ({
  arg,
  client,
  userId,
}: createServiceFeeCardTransactionProps) => {
  const { orderId, country } = arg[0];
  const customerDoc = await client
    .db('generalData')
    .collection('customerInfo')
    .findOne({ customerId: userId }, {});
  if (!customerDoc) {
    throw new Error('');
  }
  if (customerDoc.transactionId) {
    throw new Error('transaction in progress');
  }
  const _id = customerDoc._id;
  // const customerDoc = await findOne(
  //   { customerId },
  //   {},
  //   client.db('generalData').collection('customerInfo')
  // );
  const customerBalance = customerDoc?.balance || 0.0;
  // const orderDoc = await findOne(
  //   { _id: new ObjectId(orderId) },
  //   {},
  //   client.db("base").collection('orders')
  // );
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) }, {});
  if (!orderDoc) {
    throw '';
  }
  if (orderDoc.orders.find((storeOrder) => storeOrder.orderStatus !== STORE_STATUS_ACCEPTED)) {
    throw new Error('order not accepted yet');
  }
  if (orderDoc.canceled) {
    throw new Error('Order is canceled');
  }
  const serviceFee = parseFloat(orderDoc.serviceFee);
  // const managementFee = parseFloat(orderDoc.managementFee);
  const fullAmount = serviceFee;
  const amount = fullAmount - customerBalance;
  if (fullAmount <= customerDoc.balance) {
    throw new Error('your balance is sufficient');
  }
  if (amount === undefined) {
    throw 'order data not found';
  }
  const transactionId = new ObjectId();
  const now = new Date();
  console.log(transactionId);
  // await insertOne({
  //   insertDocument: {
  //     _id: transactionId,
  //     customerId: _id.toString(),
  //     amount: amount.toFixed(3),
  //     storeId: adminName,
  //     transactionDate: now,
  //     validated: false,
  //   },
  //   options: {},
  //   collection: client.db('generalData').collection('transactions'),
  // });
  const customTransactionSchema = transactionSchema.pick({});
  // type Transaction = z.infer<typeof transactionSchema>;
  const insertTransaction = client.db('generalData').collection('transactions').insertOne(
    {
      _id: transactionId,
      customerId: _id.toString(),
      amount: amount,
      storeId: adminName,
      transactionDate: now,
      validated: false,
      type: 'serviceFee',
    },
    {}
  );
  insertOne({ insertOneResult: insertTransaction });
  const { MerchantId, TerminalId, secretKey }: any = getAdminLocalCardCreds();
  await client
    .db('generalData')
    .collection('customerInfo')
    .updateOne(
      { _id: new ObjectId(_id.toString()) },
      {
        $set: {
          transactionId,
        },
      }
    );
  const configurationObject = createLocalCardConfigurationObject({
    includeLocalCardTransactionFeeToPrice: false,
    secretKey,
    now,
    MerchantId,
    TerminalId,
    amount: amount,
    transactionId,
  });
  return { configurationObject };
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createlocalCardTransaction });
};
