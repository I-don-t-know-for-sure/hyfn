'use strict';

import { mainValidateFunction } from '../common/authentication';

import aws from 'aws-sdk';
import { getMongoClientWithIAMRole } from '../common/mongodb';

export const handler = async (event, ctx) => {
  var result;
  let client = await getMongoClientWithIAMRole();

  const arg = JSON.parse(event.body);
  const { storeId, country } = arg[0];
  const { accessToken, userId } = arg[arg.length - 1];
  await mainValidateFunction(client, accessToken, userId);

  try {
    const content = await client.db('base').collection('products').find({ storeId }).toArray();

    const region = process.env.region;
    const bucketName = 'download-all-products';
    const { accessKeyId, secretAccessKey } = {
      //accessKeyId: "AKIAYTHGFE3UDZTFZJYR",
      //secretAccessKey: "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",
      accessKeyId: 'AKIAYTHGFE3UN5X7ULXD',
      secretAccessKey: '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',
    };

    console.log(accessKeyId, secretAccessKey);
    const s3 = new aws.S3({
      region,

      accessKeyId,
      secretAccessKey,
      signetureVersion: 'v4',
    });

    try {
      const destparams = {
        Bucket: bucketName,
        Key: `${storeId}.json`,
        Body: JSON.stringify(content),
        ContentType: 'application/json',
      };

      result = content;
      //await s3.putObject(destparams).promise();
    } catch (error) {
      console.log(error, 'ooooo');
      return;
    }
  } catch (error) {
    result = error.message;
  } finally {
    return JSON.stringify(result);
  }

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
