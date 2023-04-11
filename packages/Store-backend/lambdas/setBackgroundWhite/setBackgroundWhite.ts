import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import AWS, { S3 } from 'aws-sdk';
import * as stream from 'stream';
import request from 'request';
import Jimp from 'jimp';
import fs from 'fs';
import { log } from 'console';
import axios from 'axios';
import { ReadStream, createReadStream } from 'fs';
const s3 = new AWS.S3();

interface setBackgroundWhite extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
const api_url = 'https://api.backgroundremoverai.com/v1/convert/';
const results_url = 'https://api.backgroundremoverai.com/v1/results/';
const api_result_url = 'https://api.backgroundremoverai.com';

export const setBackgroundWhiteHandler = async ({ arg }) => {
  console.log('🚀 ~ file: setBackgroundWhite.ts:20 ~ setBackgroundWhiteHandler ~ arg:', arg);
  const { keys } = arg[0];
  console.log('🚀 ~ file: setBackgroundWhite.ts:21 ~ setBackgroundWhiteHandler ~ keys:', keys);
  const bucket = process.env.bucketName;
  const formData = {
    lang: 'en',
    convert_to: 'image-backgroundremover',
    files: [],
  } as any;
  for (const key of keys) {
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
  }

  //   const readStream = stream.Readable.from(buffer);
  //   const file = new Blob([buffer], { type: 'image/jpeg' });

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

  for (const file of results.files) {
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
        var buffer = await (
          await Jimp.read(`${api_result_url}${file.url}`)
        )
          .resize(screen.sizes[0], screen.sizes[1], Jimp.RESIZE_BEZIER)
          .quality(100)
          .getBufferAsync(Jimp.AUTO as any);

        //   var buffer = await sharp(origimage.Body).resize(width).toBuffer();
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
  // await downloadImageToS3(
  //   `${api_result_url}${results.files[0].url}`,
  //   bucket,
  //   'backgroundless/' + key
  // );
  // const putObjectParams = {
  //   Bucket: bucket,
  //   Key: `backgroundless/${key}`,
  //   Body: results.files[0].data,
  //   ContentType: getObjectResult.ContentType,
  // };
  // await s3.putObject(putObjectParams).promise();
  return 'success';
};
/* export const setBackgroundWhiteHandler = async ({ arg }) => {
  const { key } = arg[0];
  const bucket = process.env.bucketName;

  // for(key in keys) {}


  const getObjectParams = {
    Bucket: bucket,
    Key: 'initial/' + key,
  };


  const getObjectResult = await s3.getObject(getObjectParams).promise();
  const tmpPath = '/tmp/myfile.jpg';
  await fs.promises.writeFile(tmpPath, getObjectResult.Body as any);
  const buffer = await Jimp.read(getObjectResult.Body as any).then((image) =>
    image.getBufferAsync(Jimp.AUTO as any)
  );

  const streamObj = new stream.Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });

  console.log('🚀 ~ file: setBackgroundWhite.ts:25 ~ setBackgroundWhiteHandler ~ buffer:', buffer);
  function readStream(stream) {
    return new Promise((resolve, reject) => {
      let data = '';
      stream.on('data', (chunk) => {
        data += chunk.toString();
      });
      stream.on('error', (err) => {
        reject(err);
      });
      stream.on('end', () => {
        resolve(data);
      });
    });
  }
  const file = await fs.promises.readFile(tmpPath);
  await s3.putObject({ Bucket: bucket, Key: 'checking/' + key }).promise();
  console.log('🚀 ~ file: setBackgroundWhite.ts:56 ~ setBackgroundWhiteHandler ~ file:', file);
  const strem = fs.createReadStream(tmpPath);

  console.log('🚀 ~ file: setBackgroundWhite.ts:56 ~ setBackgroundWhiteHandler ~ strem:', strem);
  //   const readStream = stream.Readable.from(buffer);
  //   const file = new Blob([buffer], { type: 'image/jpeg' });

  const formData = {
    lang: 'en',
    convert_to: 'image-backgroundremover',
    files: strem,
  } as any;
  //   const formData = {
  //     lang: 'en',
  //     convert_to: 'image-backgroundremover',
  //     files: {
  //       value: getObjectResult.Body,
  //       options: {
  //         filename: key,
  //         contentType: getObjectResult.ContentType,
  //       },
  //     },
  //   } as any;

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
  await downloadImageToS3(
    `${api_result_url}${results.files[0].url}`,
    bucket,
    'backgroundless/' + key
  );
  // const putObjectParams = {
  //   Bucket: bucket,
  //   Key: `backgroundless/${key}`,
  //   Body: results.files[0].data,
  //   ContentType: getObjectResult.ContentType,
  // };
  // await s3.putObject(putObjectParams).promise();
  return 'success';
}; */
// const downloadImageToS3 = async (imageUrl: string, bucketName: string, objectKey: string) => {
//   const response = await axios.get(imageUrl, {
//     responseType: 'arraybuffer',
//   });

//   const objectParams = {
//     Bucket: bucketName,
//     Key: objectKey,
//     Body: response.data,
//     // ContentType: response.headers['content-type'],
//   };

//   await s3.putObject(objectParams).promise();

//   console.log(`Image downloaded and saved to S3 bucket ${bucketName} with object key ${objectKey}`);
// };
export const handler = async (event) => {
  const {
    arg: [{ keys }],
  } = JSON.parse(event.body);
  console.log('🚀 ~ file: setBackgroundWhite.ts:323 ~ handler ~ keys:', keys);
  // return await mainWrapper({ event, mainFunction: setBackgroundWhiteHandler });
  return await setBackgroundWhiteHandler({ arg: [{ keys }] });
  // await setBackgroundWhiteHandler({
  //   arg: [{ key: 'WhatsApp Image 2023-04-09 at 1.52.24 PM.jpeg' }],
  // });
};
