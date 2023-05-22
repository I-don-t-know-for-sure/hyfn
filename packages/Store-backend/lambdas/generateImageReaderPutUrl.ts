import AWS from 'aws-sdk';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

interface GenerateImageReaderPutUrlProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const generateImageReaderPutUrlHandler = async ({
  arg,
  client,
  userId,
}: GenerateImageReaderPutUrlProps) => {
  const s3 = new AWS.S3({
    signatureVersion: 'v4',
  });
  const numberOfImages = arg[0].numberOfImages;

  const imageKeys = [];
  const imageURLs = [];
  for (const i of Array(numberOfImages).keys()) {
    // Set the bucket and key of the S3 object you want to put
    const bucket = process.env.bucketName;
    const imageKey = new ObjectId().toString();
    const key = 'image-reader/' + imageKey;

    const params = {
      Bucket: bucket,
      Key: key,
      Expires: 60,
    };

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);

    console.log(`Presigned URL to put object: ${signedUrl}`);

    imageKeys.push(imageKey);
    imageURLs.push(signedUrl);
  }

  return { generatedURLs: imageURLs, generatedNames: imageKeys };
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: generateImageReaderPutUrlHandler });
};
