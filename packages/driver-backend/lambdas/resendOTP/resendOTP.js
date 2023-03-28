'use strict';

import axios from 'axios';
import { ObjectId } from 'mongodb';
import { mainValidateFunction } from '../common/authentication';
import { mainWrapper } from '../common/mainWrapper';
import { getMongoClientWithIAMRole } from '../common/mongodb';

import { findOne } from '../mongoUtils/findOne';
import { argValidations } from '../validations/resendOTPValidations';
export const handler = async (event) => {
  const mainFunction = async ({ arg, session, client, event }) => {
    var result;

    const { driverId } = arg[0];

    // await argValidations(arg);

    const driverDoc = await findOne(
      { driverId: driverId },
      {},
      client.db('generalData').collection('driverData')
    );
    console.log(driverDoc);
    if (!driverDoc.isPaying) {
      result = 'no transaction in progress';
      return;
    }
    var config = {
      method: 'post',
      url: `${process.env.sadadURL}/api/ResendOTP?transactionId=${driverDoc.transactionId}`,
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
      throw OTPStatus.data.result;
    }

    return result;
  };
  return await mainWrapper({ event, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
