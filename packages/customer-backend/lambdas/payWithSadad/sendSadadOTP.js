'use strict';

import { ObjectId } from 'mongodb';
import { mainValidateFunction } from '../common/authentication';
import { paymentMethods } from '../common/constants';
import { mainWrapperWithSession } from '../common/mainWrapperWithSession';
import { getMongoClientWithIAMRole } from '../common/mongodb';

import { findOne } from '../common/mongoUtils/findOne';
import { updateOne } from '../common/mongoUtils/updateOne';
import axios from 'axios';
export const handler = async (event) => {
  const mainFunction = async ({ arg, session, client }) => {
    console.log('shshsh');

    var result = 'initial';

    const { customerId, customerPhone, birthYear, amount } = arg[0];
    console.log(JSON.stringify(arg[0]));

    // const response = await axios({
    //   url: 'https://api.ipify.org?format=json',
    //   method: 'get',
    // });
    // console.log(response);

    // return response;
    /* 
  implement sadad payment here
  */

    const customerDoc = await findOne(
      { _id: new ObjectId(customerId) },
      { session },
      client.db('generalData').collection('customerInfo')
    );
    if (customerDoc.transaction.isPaying) {
      return (result = 'you have another transaction in progress');
    }

    //  const orderDoc = await findOne(
    //    {
    //      _id: new ObjectId(orderId),
    //    },
    //    {
    //      session,
    //    },
    //    client.db("base").collection("orders")
    //  );

    const invoiceNo = new ObjectId();

    var data = JSON.stringify({
      Msisdn: customerPhone,
      BirthYear: birthYear,
      InvoiceNo: `${invoiceNo.toString()}`,
      Amount: +amount,
      Category: 20,
    });

    var config = {
      method: 'post',
      url: `${process.env.sadadURL}/Validate`,
      headers: {
        'Authorization': 'Bearer ' + process.env.sadadApiKey,
        'Content-Type': 'application/json',
      },
      data: data,
      mode: 'no-cors',
    };

    const res = await axios(config);
    console.log('🚀 ~ file: sendSadadOTP.js ~ line 73 ~ mainFunction ~ res', res);

    if (res.data.statusCode !== 0) {
      console.log('an error happend');
      throw new Error('something went wrong');
    }

    await updateOne({
      query: { _id: new ObjectId(customerId) },
      update: {
        $set: {
          transaction: {
            isPaying: true,
            transactionId: res.data.result.transactionId,
            amountToBeAdded: amount,
            invoiceNumber: invoiceNo.toString(),
          },
        },
      },
      options: { session },
      collection: client.db('generalData').collection('customerInfo'),
    });

    result = 'success';

    return result;
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
};
