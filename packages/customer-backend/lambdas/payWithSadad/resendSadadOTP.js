'use strict';

import axios from 'axios';
import { ObjectId } from 'mongodb';

import { mainValidateFunction } from '../common/authentication';
import { mainWrapper } from '../common/mainWrapper';
import { getMongoClientWithIAMRole } from '../common/mongodb';
import { findOne } from '../common/mongoUtils/findOne';
import { updateOne } from '../common/mongoUtils/updateOne';
export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { customerId } = arg[0];

    const customerDoc = await findOne(
      { customerId: customerId },
      {},
      client.db('generalData').collection('customerInfo')
    );
    console.log(customerDoc);
    if (!customerDoc.transaction.isPaying) {
      result = 'no transaction in progress';
      return;
    }
    var config = {
      method: 'post',
      url: `${process.env.sadadURL}/ResendOTP?transactionId=${customerDoc.transaction.transactionId}`,
      headers: {
        'Authorization': 'Bearer ' + process.env.sadadApiKey,

        'Content-Type': 'application/json',
      },
      data: {},
      mode: 'no-cors',
    };

    const OTPStatus = await axios(config);
    console.log(OTPStatus);
    if (OTPStatus.data.statusCode !== 0) {
      if (OTPStatus.data.statusCode === 928) {
        return OTPStatus.data.result;
      }
      if (OTPStatus.data.statusCode === 927) {
        await updateOne({
          query: { customerId },
          update: {
            $unset: {
              transaction: '',
            },
          },
          options: {},
          collection: client.db('generalData').collection('customerInfo'),
        });
      }
      throw new Error(JSON.stringify(OTPStatus.data.result));
    }

    result = OTPStatus.data.result;

    return result;
  };
  return await mainWrapper({ event, mainFunction });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
