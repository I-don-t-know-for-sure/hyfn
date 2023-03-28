'use strict';

import { ObjectId } from 'mongodb';
import { tarnsactionStatus } from '../common/constants';

import { decryptData } from '../common/decrypt';
import { mainWrapperWithSession } from '../common/mainWrapperWithSession';

import { getMongoClientWithIAMRole } from '../common/mongodb';

import { findOne } from '../common/mongoUtils/findOne';
import { updateOne } from '../common/mongoUtils/updateOne';
import axios from 'axios';
export const handler = async (event) => {
  const mainFunction = async ({ arg, session, client, event }) => {
    var result;

    const { customerId, OTP, storeId, country, orderId } = arg[0];

    const customerDoc = await findOne(
      { _id: new ObjectId(customerId) },
      {
        session,
        projection: {
          _id: 0,
          transaction: 1,
        },
      },
      client.db('generalData').collection('customerInfo')
    );

    const storeAPIToken = await findOne(
      { _id: new ObjectId(storeId) },
      {
        projection: {
          _id: 0,
          sadadApiKey: 1,
        },
        session,
      },
      client.db('generalData').collection('storeInfo')
    );

    const decrypted = await decryptData(storeAPIToken.sadadApiKey);
    console.log(JSON.stringify(decrypted), storeId);

    const isCustomerPaying = customerDoc.transaction.isPaying;
    if (!isCustomerPaying) {
      throw new Error('no transaction yet');
    }
    const transactionId = customerDoc.transaction.transactionId;

    const data = JSON.stringify({
      TransactionId: transactionId,
      OTP,
    });

    var config = {
      method: 'post',
      url: `${process.env.sadadURL}/api/Pay`,
      headers: {
        'Authorization': 'Bearer ' + storeAPIToken.sadadApiKey,
        'Content-Type': 'application/json',
      },
      data: data,
    };

    const res = await axios(config);

    // write a guard cluas
    if (!res.data.statusCode === 0) {
      throw new Error('something went wrong');
    }

    const transactionNumber = res.data.result;

    console.log(res);
    const { isPaying, ...rest } = customerDoc.transaction;
    await updateOne({
      query: {
        _id: new ObjectId(orderId),
      },
      update: {
        $set: {
          [`orders.${storeId}.tarnsactionInfo`]: {
            status: tarnsactionStatus.paid,
            transactionNumber,
            ...rest,
          },
        },
      },
      options: { session },
      collection: client.db('base').collection('orders'),
    });

    await updateOne({
      query: {
        _id: new ObjectId(storeId),
      },
      update: {
        $inc: {
          sales: Math.abs(customerDoc.transaction.amountToBePaid),
        },
      },
      options: { session },
      collection: client.db('generalData').collection('storeInfo'),
    });
    await updateOne({
      query: {
        customerId: customerId,
      },
      update: {
        $unset: {
          transaction: '',
        },
      },
      options: {
        session,
      },
      collection: client.db('generalData').collection('customerInfo'),
    });

    //Ensures that the client will close when you finish/error
  };
  return await mainWrapperWithSession({
    mainFunction,

    event,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });

  //  Use this code if you don't use the http event with the LAMBDA-PROXY integration
  //  return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
