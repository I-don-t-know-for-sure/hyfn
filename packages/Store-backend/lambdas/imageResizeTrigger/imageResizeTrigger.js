'use strict';
const AWS = require('aws-sdk');

const util = require('util');

import * as JimpObj from 'jimp';

const s3 = new AWS.S3();
const Jimp = JimpObj.default;
export const handler = async (event, ctx) => {
  var result;

  //hdhd
  try {
    console.log('Reading options from event:\n', util.inspect(event, { depth: 5 }));
    const srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const dstBucket = srcBucket;
    const dstKey = 'resized-' + srcKey;
    const arr = dstBucket.split('/');
    const bucketName = arr[0];
    const imageArr = dstKey.split('/');
    const imageKey = imageArr[1];
    // Infer the image type from the file suffix.
    // const typeMatch = srcKey.match(/\.([^.]*)$/);
    // if (!typeMatch) {
    //   console.log("Could not determine the image type.");
    //   return;
    // }

    // Check that the image type is supported
    // const imageType = typeMatch[1].toLowerCase();
    // if (imageType != "jpg" && imageType != "png") {
    //   console.log(`Unsupported image type: ${imageType}`);
    //   return;
    // }

    // Download the image from the S3 source bucket.

    try {
      const params = {
        Bucket: srcBucket,
        Key: srcKey,
      };
      var origimage = await s3.getObject(params).promise();
    } catch (error) {
      console.log(error, 'hsssas');
      return;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // set thumbnail width. Resize will set the height automatically to maintain aspect ratio.
    var sizeArray = [
      { folder: 'laptop', sizes: [350, 350] },
      { folder: 'preview', sizes: [550, 550] },
      { folder: 'mobile', sizes: [150, 150] },
      { folder: 'tablet', sizes: [200, 200] },
    ];

    for (let i = 0; i < 4; i++) {
      var screen = sizeArray[i];

      // Use the sharp module to resize the image and save in a buffer.
      try {
        var buffer = await (await Jimp.read(origimage.Body))
          .resize(screen.sizes[0], screen.sizes[1], Jimp.RESIZE_BEZIER)
          .quality(90)
          .getBufferAsync(Jimp.AUTO);

        //   var buffer = await sharp(origimage.Body).resize(width).toBuffer();
      } catch (error) {
        console.log(error, 'hdhdh');
        return;
      }
      // Upload the thumbnail image to the destination bucket
      try {
        const destparams = {
          Bucket: dstBucket,
          Key: `${screen.folder}/${imageKey}`,
          Body: buffer,
          ContentType: 'image',
        };
        const promise = [buffer];
        Promise.allSettled(promise).then((values) => {
          console.log(values);
        });

        const putResult = await s3.putObject(destparams).promise();

        ////////
        const putPromis = [putResult];

        Promise.allSettled(putPromis).then((values) => {
          console.log(values);
        });

        console.log(putResult);
      } catch (error) {
        console.log(error, 'ooooo');
        return;
      }
    }

    console.log(`bucket = ${bucketName} ... imageKey = ${imageKey}`);
  } catch (error) {
    result = error.message;
  } finally {
    return JSON.stringify(result);
  }

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
