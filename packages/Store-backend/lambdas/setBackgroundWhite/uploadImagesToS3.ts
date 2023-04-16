import { MainFunctionProps } from 'hyfn-server';
import request from 'request';
import AWS, { S3 } from 'aws-sdk';
import Jimp from 'jimp';
const s3 = new AWS.S3();

interface UploadImagesToS3Props extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

const api_url = 'https://api.backgroundremoverai.com/v1/convert/';
const results_url = 'https://api.backgroundremoverai.com/v1/results/';
const api_result_url = 'https://api.backgroundremoverai.com';
export const uploadImagesToS3Handler = async ({ arg, client, userId }: UploadImagesToS3Props) => {
  console.log('uploadImagesToS3Handler');

  const { results } = arg[0];
  const files = [];

  for (const result of results) {
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

        /*  var buffer = await (
              await Jimp.read(`${api_result_url}${file.url}`)
            )
              .resize(screen.sizes[0], screen.sizes[1], Jimp.RESIZE_BEZIER)
              .quality(100)
              .getBufferAsync(Jimp.AUTO as any); */
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
  return 'success';
};
