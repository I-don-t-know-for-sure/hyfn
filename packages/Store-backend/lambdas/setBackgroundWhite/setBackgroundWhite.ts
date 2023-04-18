import { MainFunctionProps, getMongoClientWithIAMRole, mainWrapper } from 'hyfn-server';
import { backgroundRemovalPerImage } from 'hyfn-types';
import request from 'request';
import fs from 'fs';

import AWS, { S3 } from 'aws-sdk';
import Jimp from 'jimp';
import { ObjectId } from 'mongodb';
import { smaller } from 'mathjs';
const s3 = new AWS.S3();

interface setBackgroundWhite extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
const api_url = 'https://api.backgroundremoverai.com/v1/convert/';
const results_url = 'https://api.backgroundremoverai.com/v1/results/';
const api_result_url = 'https://api.backgroundremoverai.com';

export const setBackgroundWhiteHandler = async ({ keys, storeId, eventBusName, client }) => {
  console.log('🚀 ~ file: setBackgroundWhite.ts:21 ~ setBackgroundWhiteHandler ~ keys:', keys);

  let newKeys = [];

  // Check if the array has at least 5 elements
  if (keys.length >= 5) {
    // Use splice to remove the last 5 elements from the array and assign them to newKeys
    newKeys = keys.splice(-5);
  } else {
    // If the array has less than 5 elements, use pop to remove all the elements and assign them to newKeys
    newKeys = keys.splice(0, keys.length);
  }

  /////////////////////////////
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ _id: new ObjectId(storeId) }, { projection: { balance: true } });

  const price = backgroundRemovalPerImage * newKeys.length;

  if (smaller(storeDoc.balance, price)) {
    throw new Error('balance not enough');
  }

  await client
    .db('generalData')
    .collection('storeInfo')
    .updateOne(
      { _id: new ObjectId(storeId) },
      {
        $inc: {
          balance: -price,
        },
      }
    );

  ///////////////////////////////
  const bucket = process.env.bucketName;
  const files = [];
  for (const key of newKeys) {
    const formData = {
      lang: 'en',
      convert_to: 'image-backgroundremover',
      files: [],
    } as any;
    const getObjectParams = {
      Bucket: bucket,
      Key: 'initial/' + key,
    };

    console.log('🚀 ~ file: setBackgroundWhite.ts:30 ~ setBackgroundWhiteHandler ~ key:', key);
    const getObjectResult = await s3.getObject(getObjectParams).promise();
    const tmpPath = `/tmp/${key}.jpg`;
    await fs.promises.writeFile(tmpPath, getObjectResult.Body as any);

    const strem = fs.createReadStream(tmpPath);
    console.log('🚀 ~ file: setBackgroundWhite.ts:38 ~ setBackgroundWhiteHandler ~ strem:');

    formData.files.push(strem);

    const convertRequest = {
      url: api_url,
      method: 'post',
      formData: formData,
      headers: {
        'Authorization': '2c91437a82df4e6192ae5be05b8c8136',
        'Content-Type': 'multipart/form-data',
      },
    };
    console.log(
      '🚀 ~ file: setBackgroundWhite.ts:51 ~ setBackgroundWhiteHandler ~ convertRequest:',
      JSON.stringify(convertRequest)
    );

    const result = await new Promise((resolve, reject) => {
      request(convertRequest, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          console.log('🚀 ~ file: setBackgroundWhite.ts:60 ~ request ~ err:', body);
          resolve(JSON.parse(body));
        }
      });
    });

    console.log('🚀 ~ file: setBackgroundWhite.ts:49 ~ result ~ result:', result);

    const resultsRequest = {
      url: results_url,
      method: 'POST',
      formData: result,
    };

    const results: any = await new Promise((resolve, reject) => {
      const pollResults = () => {
        request(resultsRequest, (err, response, body) => {
          if (err) {
            reject(err);
          } else {
            const result = JSON.parse(body);
            if (result.finished) {
              resolve(result);
            } else {
              setTimeout(pollResults, 1000);
            }
          }
        });
      };
      pollResults();
    });
    console.log(
      '🚀 ~ file: setBackgroundWhite.ts:102 ~ constresults:any=awaitnewPromise ~ results:',
      results
    );

    files.push(results.files[0]);
  }

  for (const file of files) {
    const imageKey = file.url.split('/')[file.url.split('/').length - 1].split('.')[0];
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
        var productImage = await (await Jimp.read(`${api_result_url}${file.url}`))
          .resize(screen.sizes[0], screen.sizes[1], Jimp.RESIZE_BEZIER)
          .quality(100);
        const whiteImage = new Jimp(productImage.getWidth(), productImage.getHeight(), 0xffffffff);

        // Composite the images
        var buffer = await whiteImage
          .composite(productImage, 0, 0)
          .getBufferAsync(Jimp.AUTO as any);
      } catch (error) {
        console.log(error, 'hdhdh');
        return;
      }
      // Upload the thumbnail image to the destination bucket
      try {
        const destparams = {
          Bucket: process.env.bucketName,
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
  }
  console.log('🚀 ~ file: setBackgroundWhite.ts:171 ~ setBackgroundWhiteHandler ~ keys:', keys);
  if (keys.length > 0) {
    const eventBridge = new AWS.EventBridge();
    const params = {
      Entries: [
        {
          Detail: JSON.stringify({ keys: keys, eventBusName }),
          DetailType: 'background_removal',
          EventBusName: eventBusName,
          Source: 'background_removal',
        },
      ],
    };
    // put the event async
    // await eventBridge.putEvents(params).promise();
    eventBridge.putEvents(params, function (err, data) {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Success', data);
      }
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `EventBus event sent with args: `,
      }),
    };
  }

  return 'success';
};

export const handler = async (event) => {
  console.log('🚀 ~ file: setBackgroundWhite.ts:200 ~ handler ~ event:', typeof event.detail);

  const { eventBusName, keys, storeId } = event.detail;
  const client = await getMongoClientWithIAMRole();
  // console.log('🚀 ~ file: setBackgroundWhite.ts:323 ~ handler ~ keys:', keys);
  // // return await mainWrapper({ event, mainFunction: setBackgroundWhiteHandler });
  return await setBackgroundWhiteHandler({ keys, eventBusName, client: client, storeId });
};
