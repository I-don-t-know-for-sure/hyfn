'use strict';

import axios from 'axios';
import { ObjectId } from 'mongodb';

import { mainValidateFunction } from '../common/authentication';
import { mainWrapper } from '../common/mainWrapper';
import { getMongoClientWithIAMRole } from '../common/mongodb';
import { findOne } from '../mongoUtils/findOne';
export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { storeId } = arg[0];

    const storeDoc = await findOne(
      { _id: new ObjectId(storeId) },
      {},
      client.db('generalData').collection('storeInfo')
    );
    console.log(storeDoc);
    if (!storeDoc.isPaying) {
      result = 'no transaction in progress';
      return;
    }
    var config = {
      method: 'post',
      url: `${process.env.sadadURL}/api/ResendOTP?transactionId=${storeDoc.transactionId}`,
      headers: {
        'Authorization': `Bearer ${process.env.sadadApiKey}`,

        'Content-Type': 'application/json',
      },
      data: {},
      mode: 'no-cors',
    };

    const OTPStatus = await axios(config);
    console.log(OTPStatus);
    if (OTPStatus.data.statusCode === 0) {
      result = OTPStatus.data.result;
    } else {
      throw new Error(OTPStatus.data.result);
    }

    return result;
  };
  return await mainWrapper({ event, ctx, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
