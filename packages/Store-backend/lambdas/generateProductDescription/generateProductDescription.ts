import { MainFunctionProps, mainWrapper } from 'hyfn-server';

interface GenerateProductDescriptionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
import AWS from 'aws-sdk';
import axios from 'axios';
import {
  chatAfterInfo,
  chatBeforeInfo,
  chatTranslateAfter,
  chatTranslateBefore,
} from '../resources';
import { ObjectId } from 'mongodb';

const s3 = new AWS.S3({ region: 'eu-west-3' });
const rekognition = new AWS.Rekognition({ region: 'eu-west-1' });
export const generateProductDescriptionHandler = async ({
  arg,
  client,
  userId,
}: GenerateProductDescriptionProps) => {
  var text = '';
  const imageKeys = arg[0]?.imageKeys;
  const bucketFolder = 'image-reader/';
  const productId = arg[0]?.productId;

  for (const imageKey of imageKeys) {
    console.log('imageKey', imageKey);

    const object = await s3
      .getObject({ Bucket: process.env.bucketName, Key: bucketFolder + imageKey })
      .promise();
    const params: AWS.Rekognition.DetectTextRequest = {
      Image: {
        Bytes: object.Body,
      },
    };
    console.log('imageKey', imageKey);
    try {
      const result = await rekognition.detectText(params).promise();
      var blocks = result.TextDetections.filter(
        (detection) => detection.Type === 'WORD' || detection.Type === 'LINE'
      );
      // console.log(blocks);
      const textResult = blocks.reduce((acc, detection) => {
        if (detection.Type === 'LINE') {
          return `${acc}${detection.DetectedText}\n`;
        } else {
          return `${acc}${detection.DetectedText} `;
        }
      }, '');

      text += '\n' + textResult;
    } catch (error) {
      console.log('🚀 ~ file: generateProductDescription.ts:58 ~ error:', error);
    }
  }

  /*  const object = await s3
    .getObject({ Bucket: process.env.bucketName, Key: bucketFolder + imageKey[0] })
    .promise();
  const params: AWS.Rekognition.DetectTextRequest = {
    Image: {
      Bytes: object.Body,
    },
  };
  console.log(
    '🚀 ~ file: generateProductDescription.ts:39 ~ text ~ text:',
    bucketFolder + imageKey
  );
  try {
    const result = await rekognition.detectText(params).promise();
    var blocks = result.TextDetections.filter(
      (detection) => detection.Type === 'WORD' || detection.Type === 'LINE'
    );
    // console.log(blocks);
    const textResult = blocks.reduce((acc, detection) => {
      if (detection.Type === 'LINE') {
        return `${acc}${detection.DetectedText}\n`;
      } else {
        return `${acc}${detection.DetectedText} `;
      }
    }, '');
  } catch (error) {
    console.log('🚀 ~ file: generateProductDescription.ts:38 ~ error:', error);
    throw new Error('error');
  }
 */

  /////////////////////////////

  console.log('🚀 ~ file: generateProductDescription.ts:39 ~ text ~ text:', text);

  const API_KEY = process.env.chat_gpt_api_key;
  const prompt = createChatPrompt(text);

  // Make the API request
  try {
    const chatResult = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      data: {
        model: 'gpt-3.5-turbo',
        // prompt: prompt,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 2000,
        // "top_p": 1,
        // "frequency_penalty": 0,
        // "presence_penalty": 0
      },
    });
    const translatePrompt = createTranslatePrompt(chatResult);
    const translateResult = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      data: {
        model: 'gpt-3.5-turbo',
        // prompt: prompt,
        messages: [{ role: 'user', content: translatePrompt }],
        temperature: 0.5,
        max_tokens: 1000,
        // "top_p": 1,
        // "frequency_penalty": 0,
        // "presence_penalty": 0
      },
    });

    const productDescription = `${chatResult.data.choices[0].message.content} \n\n\n ${translateResult.data.choices[0].message.content}`;
    console.log(
      '🚀 ~ file: generateProductDescription.ts:61 ~ chatResult:',
      JSON.stringify(chatResult.data, null, 2)
    );
    await client
      .db('base')
      .collection('products')
      .updateOne(
        { _id: new ObjectId(productId) },
        {
          $set: {
            'textInfo.description': productDescription,
          },
        }
      );
  } catch (error) {
    console.log('🚀 ~ file: generateProductDescription.ts:55 ~ error:', error);
    throw new Error('error');
  }

  // .then((response) => {
  //   console.log(response.data.choices[0].text);
  // })
  // .catch((error) => {
  //   console.error(error);
  // });
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: generateProductDescriptionHandler });
};

const createChatPrompt = (prompt: any) => {
  return `${chatBeforeInfo} ${prompt} ${chatAfterInfo}`;
};
const createTranslatePrompt = (prompt: any) => {
  return `${chatTranslateBefore} ${prompt} ${chatTranslateAfter}`;
};
