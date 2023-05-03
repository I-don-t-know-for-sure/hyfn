'use strict';

const axios = require('axios');
import { ObjectId } from 'mongodb';
import { mainValidateFunction } from './common/authentication';
import { mainWrapperWithSession } from './common/mainWrapperWithSession';
import { getMongoClientWithIAMRole } from './common/mongodb';
import { findOne } from '../mongoUtils/findOne';
import { updateOne } from './common/mongoUtils/updateOne';
import { insertOne } from './common/mongoUtils/insertOne';

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client, session }) => {
    var result = 'initial';

    const { storeId, amountToBeAdded, payerPhone, birthYear } = arg[0];

    /* 
    implement sadad payment here
    */
    function getRandomNumberBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const invoiceNo = new ObjectId().toString();
    var data = {
      Msisdn: payerPhone,
      BirthYear: birthYear,
      InvoiceNo: invoiceNo,
      amount: amountToBeAdded,
      Category: 20,
    };

    var config = {
      method: 'post',
      url: `${process.env.sadadURL}/api/Validate`,
      headers: {
        'Authorization': `Bearer ${process.env.sadadApiKey}`,

        'Content-Type': 'application/json',
      },
      data: data,
      mode: 'no-cors',
    };

    const storeDoc = await findOne(
      { _id: new ObjectId(storeId) },
      { session },
      client.db('generalData').collection('storeInfo')
    );
    if (storeDoc.isPaying) {
      return (result = 'you have another transaction in progress');
    }
    console.log(storeDoc);

    const res = await axios(config);
    console.log(res.data);
    if (res.data.statusCode === 0) {
      await insertOne({
        insertDocument: {
          storeId,
          transactionId: invoiceNo,
        },
        options: { session },
        collection: client.db('generalData').collection('storeTransactions'),
      });

      await updateOne({
        query: { _id: new ObjectId(storeId) },
        update: {
          $set: {
            isPaying: true,
            transactionId: res.data.result.transactionId,
            amountToBeAdded,
          },
        },
        options: { session },
        collection: client.db('generalData').collection('storeInfo'),
      });
      result = 'success';
      return;
    }
    result = res.data;

    return result;
  };
  return await mainWrapperWithSession({
    event,
    ctx,
    mainFunction,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });
};
