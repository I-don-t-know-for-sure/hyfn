'use strict';

const axios = require('axios');
import { ObjectId } from 'mongodb';
import { mainValidateFunction } from '../common/authentication';
import { mainWrapper } from '../common/mainWrapper';
import { getMongoClientWithIAMRole } from '../common/mongodb';
import { findOne } from '../mongoUtils/findOne';

import { argValidations } from '../validations/sendOTPValidation';
import { updateOne } from '../common/mongoUtils/updateOne';
export const handler = async (event) => {
  const mainFunction = async ({ arg, session, client, event }) => {
    var result = 'initial';
    console.log(event);
    const { driverId, amountToBeAdded, customerPhone, birthYear } = arg[0];
    const { accessToken, userId } = arg[1];
    // await argValidations(arg);
    await mainValidateFunction(client, accessToken, userId);

    /* 
  implement sadad payment here
  */
    function getRandomNumberBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    // ff

    const invoiceNo = getRandomNumberBetween(1, 999);
    var data = {
      Msisdn: customerPhone,
      BirthYear: birthYear,
      InvoiceNo: `${invoiceNo}`,
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

    const driverDoc = await findOne(
      { driverId: driverId },
      { session },
      client.db('generalData').collection('driverData')
    );
    if (driverDoc.isPaying) {
      return (result = 'you have another transaction in progress');
    }
    console.log(driverDoc);

    const res = await axios(config);
    console.log(res.data);
    if (res.data.statusCode === 0) {
      await updateOne({
        query: { driverId: driverId },
        update: {
          $set: {
            isPaying: true,
            transactionId: res.data.result.transactionId,
            amountToBeAdded,
          },
        },
        options: { session },
        collection: client.db('generalData').collection('driverData'),
      });
      result = 'success';
      return;
    }
    result = res.data;

    return result;
  };
  return await mainWrapper({ event, mainFunction });
};
