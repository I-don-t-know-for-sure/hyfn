interface GenerateImageURLProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, _200 } from 'hyfn-server';
const aws = require('aws-sdk');
const crypto = require('crypto');
const { promisify } = require('util');
export const handler = async (event, ctx) => {
  var result;
  const arg = JSON.parse(event.body);
  const numberOfGeneratedURLs = arg[0];
  const { accessToken, userId } = arg[1];
  try {
    const randomBytes = promisify(crypto.randomBytes);
    const region = process.env.region;
    const bucketName = process.env.bucketName;
    const { accessKeyId, secretAccessKey } = {
      //accessKeyId: "AKIAYTHGFE3UDZTFZJYR",
      //secretAccessKey: "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",
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    };
    console.log(accessKeyId, secretAccessKey);
    const s3 = new aws.S3({
      region,
      accessKeyId,
      secretAccessKey,
      signetureVersion: 'v4',
    });
    const screens = ['initial'];
    const generatedURLs = [];
    const generatedNames = [];
    for (let i = 0; i < numberOfGeneratedURLs; i++) {
      const rawBytes = await randomBytes(16);
      const imageName = rawBytes.toString('hex');
      const imageVarients = [];
      for (let x = 0; x < screens.length; x++) {
        const params = {
          Bucket: bucketName,
          Key: `${screens[x]}/${imageName}`,
          Expires: 60,
        };
        const uploadURL = await s3.getSignedUrlPromise('putObject', params);
        imageVarients.push(uploadURL);
      }
      generatedURLs.push(...imageVarients);
      generatedNames.push(imageName);
    }
    result = { generatedURLs, generatedNames };
    return;
  } catch (error) {
    result = error.message;
  } finally {
    return _200(result);
  }
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
