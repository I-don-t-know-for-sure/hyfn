interface UpdateStoreOwnerInfoProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { ObjectId } from 'mongodb';

import {
  sadadCategoryNumber,
  sadadTestAmount,
  sadadTestBirthYear,
  sadadTestPhoneNumber,
} from '../resources';
import axios from 'axios';
import { encryptData, MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { KMS } from 'aws-sdk';

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client, session }: MainFunctionProps) => {
    var result;

    const { storeFrontId, id, city, country } = arg[0];
    const newInfo = arg[1];

    const { imgaeObj, ...newStore } = newInfo;
    const mongo = client.db('base');
    const storeCollection = client.db('generalData').collection(`storeInfo`);

    const oldStoreDoc = await storeCollection.findOne({ _id: new ObjectId(id) }, { session });

    const apiKeys: any = {};
    const apiKeysFilled: any = {};
    if (!oldStoreDoc.sadadFilled && newInfo.sadadApiKey) {
      const invoiceNo = new ObjectId();

      var data = JSON.stringify({
        Msisdn: sadadTestPhoneNumber,
        BirthYear: sadadTestBirthYear,
        InvoiceNo: `${invoiceNo.toString()}`,
        Amount: sadadTestAmount,
        Category: sadadCategoryNumber,
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

      if (typeof res.data.statusCode !== 'number') {
        console.log('an error happend');
        throw new Error('something went wrong');
      }

      apiKeys.sadadFilled = true;
      apiKeys.sadadApiKey = await encryptData(
        newInfo.sadadApiKey,
        process.env.kmsKeyARN || '',
        new KMS()
      );
      apiKeysFilled.sadadFilled = true;
    }

    if (Object.keys(apiKeys).length > 0) {
      await client
        .db('base')
        .collection('storeFronts')
        .updateOne(
          { _id: new ObjectId(id) },
          {
            $set: { ...apiKeysFilled },
          },
          { session }
        );
    }

    await storeCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { ...newStore, ...apiKeys },
      },
      { session }
    );

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

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
