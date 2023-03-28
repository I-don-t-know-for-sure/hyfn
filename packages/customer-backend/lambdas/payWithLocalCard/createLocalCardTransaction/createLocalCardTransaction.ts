import { ObjectId } from 'mongodb';

import { adminName } from 'hyfn-types';

import { getAdminLocalCardCreds } from '../../common/getAdminLocalCardCreds';
import { MainFunctionProps } from 'hyfn-server/src';
import { findOne, mainWrapper } from 'hyfn-server/src';
import { createLocalCardConfigurationObject } from 'hyfn-server/src';

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
const createlocalCardTransaction = async ({ arg, client }: createLocalCardTransaction) => {
  const { customerId } = arg[0];

  // const customerDoc = await findOne(
  //   { _id: new ObjectId(customerId) },
  //   {},
  //   client.db('generalData').collection('customerInfo')

  //   );

  const customerDoc = await client
    .db('generalData')
    .collection('customerInfo')
    .findOne({ _id: new ObjectId(customerId) }, {});
  findOne({ findOneResult: customerDoc });

  if (customerDoc.transactionId) {
    throw new Error('transaction in progress');
  }

  console.log(
    '🚀 ~ file: createLocalCardTransaction.js:27 ~ createlocalCardTransaction ~ customerDoc',
    customerDoc
  );
  console.log(
    '🚀 ~ file: createLocalCardTransaction.js:27 ~ createlocalCardTransaction ~ customerDoc',
    customerDoc
  );
  const customerBalance = customerDoc?.balance || 0.0;
  console.log(
    '🚀 ~ file: createLocalCardTransaction.js:32 ~ createlocalCardTransaction ~ customerBalance',
    customerBalance
  );
  console.log(customerDoc?.order?.deliveryDetails?.serviceFee);
  const amount = customerDoc?.order?.deliveryDetails?.serviceFee - customerBalance;
  console.log(
    '🚀 ~ file: createLocalCardTransaction.js:32 ~ createlocalCardTransaction ~ amount',
    amount
  );
  console.log(
    '🚀 ~ file: createLocalCardTransaction.js:32 ~ createlocalCardTransaction ~ amount',
    amount
  );

  if (!amount) {
    throw 'order data not found';
  }

  const transactionId = new ObjectId();
  const now = new Date();
  console.log(transactionId);

  // await insertOne({
  //   insertDocument: {
  //     _id: transactionId,
  //     customerId,
  //     amount: amount.toFixed(3),
  //     storeId: adminName,
  //     transactionDate: now,
  //     validated: false,
  //   },
  //   options: {},
  //   collection: client.db('generalData').collection('transactions'),
  // });

  const insertTransaction = await client.db('generalData').collection('transactions').insertOne(
    {
      _id: transactionId,
      customerId,
      amount: amount,
      storeId: adminName,
      transactionDate: now,
      validated: false,
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

  const { MerchantId, TerminalId, secretKey }: any = getAdminLocalCardCreds();
  console.log('hdcbdh');
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
