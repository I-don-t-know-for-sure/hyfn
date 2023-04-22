import { MainFunctionProps, getMongoClientWithIAMRole, mainWrapper } from 'hyfn-server';
import { backgroundRemovalPerImage } from 'hyfn-types';
import request from 'request';
import fs from 'fs';

import AWS, { S3 } from 'aws-sdk';
import Jimp from 'jimp';
import { ObjectId } from 'mongodb';
import { smaller } from 'mathjs';
import axios from 'axios';
const s3 = new AWS.S3();

interface setBackgroundWhite extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
const api_url = 'https://api.backgroundremoverai.com/v1/convert/';
const results_url = 'https://api.backgroundremoverai.com/v1/results/';
const api_result_url = 'https://api.backgroundremoverai.com';

export const setBackgroundWhiteHandler = async ({
  productIds,
  client,
  eventBusName,
  url,
  storeId,
}: {
  url: string;

  productIds: string[];
  storeId: string;
  eventBusName: string;
  client: MainFunctionProps['client'];
}) => {
  const productId = productIds.pop();
  const product = await client
    .db('base')
    .collection('products')
    .findOne(
      { _id: new ObjectId(productId) },
      { projection: { images: true, whiteBackgroundImages: true } }
    );
  const newKeys = product.images.filter((image) => {
    return !product?.whiteBackgroundImages?.find(
      (whiteBackgroundImage) => whiteBackgroundImage === image
    );
  });
  console.log('🚀 ~ file: setBackgroundWhite.ts:43 ~ newKeys ~ newKeys:', newKeys);
  // let newKeys = [];

  // Check if the array has at least 5 elements

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

  ///////////////////////////
  await client
    .db('base')
    .collection('products')
    .updateOne(
      { _id: new ObjectId(productId) },
      {
        $push: {
          whiteBackgroundImages: { $each: newKeys },
        },
      }
    );
  ///////////////////////////

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
      { folder: 'preview', sizes: [] },
      { folder: 'mobile', sizes: [150, 150] },
      { folder: 'tablet', sizes: [300, 300] },
    ];

    for (let i = 0; i < sizeArray.length; i++) {
      var screen = sizeArray[i];

      // Use the sharp module to resize the image and save in a buffer.
      try {
        var originalImage = await Jimp.read(`${api_result_url}${file.url}`);
        var productImage;
        if (screen.folder === 'preview') {
          productImage = await originalImage
            .resize(originalImage.bitmap.width, originalImage.bitmap.height, Jimp.RESIZE_BEZIER)
            .quality(100);
        } else {
          productImage = await originalImage
            .resize(screen.sizes[0], screen.sizes[1], Jimp.RESIZE_BEZIER)
            .quality(100);
        }
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
  console.log(
    '🚀 ~ file: setBackgroundWhite.ts:171 ~ setBackgroundWhiteHandler ~ keys:',
    productIds
  );
  if (productIds.length > 0) {
    axios
      .post(url, {
        productIds,
        storeId,
        url,
      })
      .catch((err) => {
        console.log(err);
      });
    /* const eventBridge = new AWS.EventBridge();
    const params = {
      Entries: [
        {
          Detail: JSON.stringify({ productIds, eventBusName, storeId }),
          EventBusName: eventBusName,
          DetailType: process.env.backgroundRemovalEventBusDetailType,
          Source: process.env.backgroundRemovalEventBusSource,
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
    }; */
  }

  return 'success';
};

export const handler = async (event) => {
  console.log('🚀 ~ file: setBackgroundWhite.ts:200 ~ handler ~ event:', event);

  const { eventBusName, productIds, storeId, url } = JSON.parse(event.body);
  const client = await getMongoClientWithIAMRole();
  // console.log('🚀 ~ file: setBackgroundWhite.ts:323 ~ handler ~ keys:', keys);
  // // return await mainWrapper({ event, mainFunction: setBackgroundWhiteHandler });
  return await setBackgroundWhiteHandler({
    productIds,
    eventBusName,
    client: client,
    storeId,
    url,
  });
};
