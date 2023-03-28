'use strict';

import axios from 'axios';
import { ObjectId } from 'mongodb';

import { mainValidateFunction } from '../common/authentication';
import { findOne } from '../common/mongoUtils/findOne';
import { simpleCrypto } from '../common/encryption';
import { getMongoClientWithIAMRole } from '../common/mongodb';
import { decryptData } from '../common/decrypt';
import { mainWrapper } from '../common/mainWrapper';
import { updateOne } from '../common/mongoUtils/updateOne';
export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { customerId, storeId } = arg[0];

    const customerDoc = await findOne(
      { _id: new ObjectId(customerId) },
      {},
      client.db('generalData').collection('customerInfo')
    );
    console.log(customerDoc);
    if (!customerDoc.transaction.isPaying) {
      throw new Error('no transaction in progress');
    }

    const storeAPIToken = await findOne(
      { _id: new ObjectId(storeId) },
      {
        projection: {
          _id: 0,
          sadadApiKey: 1,
        },
      },
      client.db('generalData').collection('storeInfo')
    );

    const sadadApiKey = await decryptData(storeAPIToken.sadadApiKey);
    console.log('sadadApiKey 41', sadadApiKey);
    var config = {
      method: 'post',
      url: `${process.env.sadadURL}/api/ResendOTP?transactionId=${customerDoc.transaction.transactionId}`,
      headers: {
        'Authorization': 'Bearer ' + sadadApiKey,

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
};
