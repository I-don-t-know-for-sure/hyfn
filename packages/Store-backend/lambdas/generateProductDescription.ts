import { MainFunctionProps, mainWrapper, tStores } from 'hyfn-server';
import { descriptionGenerationPricePerImage } from 'hyfn-types';
interface GenerateProductDescriptionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
import AWS from 'aws-sdk';
import axios from 'axios';
import { chatAfterInfo, chatBeforeInfo, chatTranslateAfter, chatTranslateBefore } from 'hyfn-types';
import { ObjectId } from 'mongodb';
import { smaller } from 'mathjs';
import { getDb } from 'hyfn-server/src/functions/getDb';
import { sql } from 'kysely';

const s3 = new AWS.S3({ region: process.env.region });
const rekognition = new AWS.Rekognition({ region: 'eu-west-1' });
export const generateProductDescriptionHandler = async ({
  products,
  eventBusName,
  db,
  storeId,
  url,
}: {
  products: any[];
  eventBusName: string;
  db: MainFunctionProps['db'];
  storeId: string;

  url: string;
}) => {
  const product = products.pop();

  var text = '';
  const imageKeys = product?.imageKeys;

  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('id', '=', storeId)
    .executeTakeFirstOrThrow();
  const price = descriptionGenerationPricePerImage * imageKeys.length;

  if (smaller(storeDoc.balance, price)) {
    throw new Error('balance not enough');
  }

  await db
    .updateTable('stores')
    .set({
      balance: sql`${sql.raw(tStores.balance)} - ${price}`,
    })
    .where('id', '=', storeId)
    .executeTakeFirst();
  const bucketFolder = 'image-reader/';
  const productId = product?.productId;

  for (const imageKey of imageKeys) {
    const object = await s3
      .getObject({ Bucket: process.env.bucketName, Key: bucketFolder + imageKey })
      .promise();
    const params: AWS.Rekognition.DetectTextRequest = {
      Image: {
        Bytes: object.Body,
      },
    };

    try {
      const result = await rekognition.detectText(params).promise();
      var blocks = result.TextDetections.filter(
        (detection) => detection.Type === 'WORD' || detection.Type === 'LINE'
      );

      const textResult = blocks.reduce((acc, detection) => {
        if (detection.Type === 'LINE') {
          return `${acc}${detection.DetectedText}\n`;
        } else {
          return `${acc}${detection.DetectedText} `;
        }
      }, '');

      text += '\n' + textResult;
    } catch (error) {}
  }

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

        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 2000,
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

        messages: [{ role: 'user', content: translatePrompt }],
        temperature: 0.5,
        max_tokens: 1000,
      },
    });

    const productDescription = `${chatResult.data.choices[0].message.content} \n\n\n ${translateResult.data.choices[0].message.content}`;

    await db
      .updateTable('products')
      .set({
        description: productDescription,
      })
      .where('id', '=', productId)
      .executeTakeFirst();

    await db
      .insertInto('productDescriptions')
      .values({
        productId,
        description: productDescription,
      })
      .execute();
  } catch (error) {
    throw new Error('error');
  }

  if (products.length > 0) {
    axios.post(url, { products, storeId, eventBusName: eventBusName, url });
  }
};

export const handler = async (event) => {
  const { eventBusName, products, storeId, url } = JSON.parse(event.body);
  const db = await getDb();

  return await generateProductDescriptionHandler({ db, eventBusName, products, storeId, url });
};

const createChatPrompt = (prompt: any) => {
  return `${chatBeforeInfo} ${prompt} ${chatAfterInfo}`;
};
const createTranslatePrompt = (prompt: any) => {
  return `${chatTranslateBefore} ${prompt} ${chatTranslateAfter}`;
};
