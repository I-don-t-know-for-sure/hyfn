'use strict';
const AWS = require('aws-sdk');

const util = require('util');

import * as JimpObj from 'jimp';

const s3 = new AWS.S3();
const Jimp = JimpObj.default;
export const handler = async (event, ctx) => {
  var result;

  try {
    console.log('Reading options from event:\n', util.inspect(event, { depth: 5 }));
    const srcBucket = event.Records[0].s3.bucket.name;

    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const dstBucket = srcBucket;
    const dstKey = 'resized-' + srcKey;
    const arr = dstBucket.split('/');
    const bucketName = arr[0];
    const imageArr = dstKey.split('/');
    const imageKey = imageArr[1];

    try {
      const params = {
        Bucket: srcBucket,
        Key: srcKey,
      };
      var origimage = await s3.getObject(params).promise();
    } catch (error) {
      throw error;
    }

    await resizeAndSaveImages(origimage, dstBucket, imageKey);
  } catch (error) {
    result = error.message;
  } finally {
    return JSON.stringify(result);
  }
};

async function resizeAndSaveImages(origimage, dstBucket, imageKey) {
  const sizeArray = [
    { folder: 'preview', sizes: [] },
    { folder: 'mobile', sizes: [150, 150] },
    { folder: 'tablet', sizes: [300, 300] },
  ];

  const promises = [];

  for (let i = 0; i < sizeArray.length; i++) {
    const screen = sizeArray[i];
    let buffer;
    const original = await Jimp.read(origimage.Body);
    if (screen.folder === 'preview') {
      buffer = await (await Jimp.read(origimage.Body))
        .resize(original.bitmap.width, original.bitmap.height, Jimp.RESIZE_BEZIER)
        .quality(100)
        .getBufferAsync(Jimp.AUTO);
    } else {
      buffer = await (await Jimp.read(origimage.Body))
        .resize(screen.sizes[0], screen.sizes[1], Jimp.RESIZE_BEZIER)
        .quality(100)
        .getBufferAsync(Jimp.AUTO);
    }
    const destparams = {
      Bucket: dstBucket,
      Key: `${screen.folder}/${imageKey}`,
      Body: buffer,
      ContentType: 'image',
    };

    const putResult = s3.putObject(destparams).promise();

    promises.push(putResult);
  }

  try {
    const values = await Promise.allSettled(promises);
  } catch (error) {
    throw error;
  }
}
