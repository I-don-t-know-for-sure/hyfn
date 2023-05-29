'use strict';

import { ObjectId } from 'mongodb';
import { paymentMethods } from 'hyfn-types';
import { mainWrapperWithSession } from '../common/mainWrapperWithSession';

import { findOne } from '../common/mongoUtils/findOne';
import { updateOne } from '../common/mongoUtils/updateOne';
import { insertOne } from '../common/mongoUtils/insertOne';
import axios from 'axios';
import { returnsObj } from 'hyfn-types';
export const handler = async (event) => {
  const mainFunction = async ({ arg, session, client }) => {
    const { customerId, OTP } = arg[0];

    /* 
      implement sadad payment here
      */

    const customerDoc = await findOne(
      { customerId: customerId },
      {
        session,
      },
      client.db('generalData').collection('customerInfo')
    );

    const transactionId = customerDoc.transaction.transactionId;
    //  const res = await fetch("https://jsonip.com", { mode: "cors" });
    // const data = await res.json();
    // console.log(data);
    var data = JSON.stringify({
      TransactionId: transactionId,
      OTP,
    });

    var config = {
      method: 'post',
      url: `${process.env.sadadURL}/Pay`,
      headers: {
        'Authorization': 'Bearer ' + process.env.sadadApiKey,
        'Content-Type': 'application/json',
      },
      data: data,
    };

    const res = await axios(config);
    console.log('🚀 ~ file: payWithSadad.js ~ line 45 ~ mainFunction ~ res', res);

    if (res.data.statusCode !== 0) {
      throw new Error(returnsObj['something went wrong']);
    }

    // if sadad payment is successful we add the amount to the customer's top up balance

    // insert a new transaction document

    await insertOne({
      insertDocument: {
        id: new ObjectId(customerDoc.transaction.invoiceNumber),
        paymentMethod: paymentMethods.sadad,
        successful: true,
        amount: customerDoc.transaction.amountToBeAdded,
        sadadTransactionNumber: res.data.result,
        transactionId,
      },
      options: {
        session,
      },
      collection: client.db('generalData').collection('transactions'),
    });

    //////////

    await updateOne({
      query: {
        customerId: customerId,
      },
      update: {
        $unset: {
          transaction: '',
        },
        $inc: {
          balance: Math.abs(parseFloat(customerDoc.transaction.amountToBeAdded.toFixed(3))),
        },
      },
      options: {
        session,
      },
      collection: client.db('generalData').collection('customerInfo'),
    });
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
  //Ensures that the client will close when you finish/error

  //  Use this code if you don't use the http event with the LAMBDA-PROXY integration
  //  return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
