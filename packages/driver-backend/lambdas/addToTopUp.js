'use strict';

import axios from 'axios';
import { ObjectId } from 'mongodb';
import { mainValidateFunction } from './common/authentication';
import { mainWrapperWithSession } from './common/mainWrapperWithSession';
import client from './common/mongodb';
import { updateOne } from './common/mongoUtils/updateOne';
export const handler = async (event) => {
  const mainFunction = async ({ arg, session, client, event }) => {
    var result;

    const { driverId, OTP, amountToBeAdded /* temporary */ } = arg[0];

    const customerDoc = await client
      .db('generalData')
      .collection('driverData')
      .findOne({ driverId: driverId }, { session });
    // if (!customerDoc.isPaying) {
    //   return "no transaction in progress";
    // }

    const config = {
      method: 'post',
      url: `${process.env.sadadURL}/api/Pay`,
      headers: {
        'Authorization': `Bearer ${process.env.sadadApiKey}`,

        'Content-Type': 'application/json',
      },
      data: {
        OTP: OTP,
        transactionId: customerDoc.transactionId,
      },
      mode: 'no-cors',
    };

    // const payment = await axios(config);
    // console.log(payment.data);
    // if (payment.data.statusCode === 927) {
    //   result = payment.data.result;
    //   return;
    // }
    // if (payment.data.statusCode !== 0) {
    //   throw "transaction went wrong";
    // }

    // result = payment.data;

    await updateOne({
      query: { driverId: driverId },
      update: {
        $inc: {
          balance: Math.abs(parseFloat(amountToBeAdded.toFixed(3))),
        },
        $set: {
          isPaying: false,

          amountToBeAdded: 0,
          transactionId: 0,
        },
      },
      options: { session },
      collection: client.db('generalData').collection('driverData'),
    });

    /* 
            add transactionId and other payment info like phone number and maybe time to customerData collection
            */

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
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
